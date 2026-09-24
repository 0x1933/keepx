import { Connection, PublicKey } from "@solana/web3.js";
import { PoolUtils, Raydium, TickUtil, TxVersion } from "@raydium-io/raydium-sdk-v2";
import BN from "bn.js";
import Decimal from "decimal.js";
import { assertAllowlistedPool, getRaydiumMaxLamports, getRaydiumRpcUrl } from "@/lib/raydium/config";
import { inspectTransaction, simulateTransaction } from "@/lib/solana/tx-helpers";

type OpenPositionInput = {
  wallet: string;
  poolId: string;
  lowerPrice: string;
  upperPrice: string;
  baseAmount: string;
  slippageBps?: number;
};

function publicKey(value: unknown, label: string) {
  if (typeof value !== "string" || !value) throw new Error(`${label} is required.`);
  return new PublicKey(value);
}

function poolMintsMatch(poolSummary: ReturnType<typeof assertAllowlistedPool>, mintA: string, mintB: string) {
  const expected = [poolSummary.baseMint, poolSummary.quoteMint].sort();
  const actual = [mintA, mintB].sort();
  return expected[0] === actual[0] && expected[1] === actual[1];
}

export async function prepareClmmOpenPosition(input: OpenPositionInput) {
  const wallet = publicKey(input.wallet, "Wallet");
  const poolSummary = assertAllowlistedPool(input.poolId);
  const poolId = new PublicKey(poolSummary.id);

  const lowerPrice = new Decimal(input.lowerPrice);
  const upperPrice = new Decimal(input.upperPrice);
  if (!lowerPrice.isFinite() || !upperPrice.isFinite() || lowerPrice.gte(upperPrice)) {
    throw new Error("Invalid price range.");
  }

  const depositAmount = new Decimal(input.baseAmount);
  if (!depositAmount.isFinite() || depositAmount.lte(0)) {
    throw new Error("Deposit amount must be greater than zero.");
  }

  const slippageBps = input.slippageBps === undefined ? 50 : Math.floor(Number(input.slippageBps));
  const rpcUrl = getRaydiumRpcUrl();
  const connection = new Connection(rpcUrl, "confirmed");

  const raydium = await Raydium.load({
    owner: wallet,
    connection,
    cluster: "mainnet",
    disableFeatureCheck: true,
    blockhashCommitment: "confirmed"
  });

  const { poolInfo } = await raydium.clmm.getPoolInfoFromRpc(poolId.toBase58());
  if (!poolMintsMatch(poolSummary, poolInfo.mintA.address, poolInfo.mintB.address)) {
    throw new Error("Pool mint pair does not match allowlist metadata.");
  }

  const baseIsMintA = poolInfo.mintA.address === poolSummary.baseMint;
  const baseSide = baseIsMintA ? "MintA" : "MintB";
  const baseDecimals = baseIsMintA ? poolInfo.mintA.decimals : poolInfo.mintB.decimals;
  const baseAmount = new BN(depositAmount.mul(new Decimal(10).pow(baseDecimals)).toFixed(0));

  const maxLamports = getRaydiumMaxLamports();
  if (baseAmount.lte(new BN(0)) || BigInt(baseAmount.toString()) > maxLamports) {
    throw new Error("Amount invalid or over max.");
  }

  const zeroForOne = baseIsMintA;
  const lower = TickUtil.getPriceAndTick({
    price: lowerPrice,
    mintADecimals: poolInfo.mintA.decimals,
    mintBDecimals: poolInfo.mintB.decimals,
    zeroForOne,
    tickSpacing: poolInfo.config.tickSpacing
  });
  const upper = TickUtil.getPriceAndTick({
    price: upperPrice,
    mintADecimals: poolInfo.mintA.decimals,
    mintBDecimals: poolInfo.mintB.decimals,
    zeroForOne,
    tickSpacing: poolInfo.config.tickSpacing
  });

  if (lower.tick >= upper.tick) {
    throw new Error("Invalid tick ordering.");
  }

  const liquidity = await PoolUtils.getLiquidityAmountOutFromAmountIn({
    poolInfo,
    inputA: baseIsMintA,
    tickLower: lower.tick,
    tickUpper: upper.tick,
    amount: baseAmount,
    slippage: slippageBps / 10_000,
    add: true,
    epochInfo: await connection.getEpochInfo(),
    amountHasFee: false
  });

  const prepared = await raydium.clmm.openPositionFromBase({
    poolInfo,
    tickLower: lower.tick,
    tickUpper: upper.tick,
    base: baseSide,
    baseAmount,
    otherAmountMax: baseIsMintA ? liquidity.amountSlippageB.amount : liquidity.amountSlippageA.amount,
    txVersion: TxVersion.V0,
    ownerInfo: { useSOLBalance: true },
    associatedOnly: false,
    computeBudgetConfig: { units: 600_000, microLamports: 1_000 }
  });

  const serialized = prepared.transaction.serialize();
  const diagnostics = inspectTransaction(prepared.transaction, serialized.length);
  const simulation = await simulateTransaction(prepared.transaction, rpcUrl, { replaceRecentBlockhash: true });

  return {
    status: "prepared" as const,
    transactionBase64: Buffer.from(serialized).toString("base64"),
    poolId: poolId.toBase58(),
    poolPrice: String(poolInfo.price),
    lowerPrice: lower.price.toString(),
    upperPrice: upper.price.toString(),
    lowerTick: lower.tick,
    upperTick: upper.tick,
    baseAmount: baseAmount.toString(),
    baseSymbol: poolSummary.baseSymbol,
    diagnostics,
    instructionTypes: prepared.instructionTypes,
    position: {
      nftMint: prepared.extInfo.nftMint.toBase58(),
      positionNftAccount: prepared.extInfo.positionNftAccount.toBase58()
    },
    simulation
  };
}
