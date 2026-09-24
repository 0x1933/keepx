import { Connection, PublicKey } from "@solana/web3.js";
import { PoolUtils, Raydium, TxVersion } from "@raydium-io/raydium-sdk-v2";
import { allowlistedPools } from "@/lib/pools";
import { assertAllowlistedPool, getRaydiumRpcUrl } from "@/lib/raydium/config";
import { inspectTransaction, simulateTransaction } from "@/lib/solana/tx-helpers";

function publicKey(value: unknown, label: string) {
  if (typeof value !== "string" || !value) throw new Error(`${label} is required.`);
  return new PublicKey(value);
}

async function loadRaydium(wallet: PublicKey) {
  const rpcUrl = getRaydiumRpcUrl();
  const connection = new Connection(rpcUrl, "confirmed");
  const raydium = await Raydium.load({
    owner: wallet,
    connection,
    cluster: "mainnet",
    disableFeatureCheck: true,
    blockhashCommitment: "confirmed"
  });

  return { rpcUrl, connection, raydium };
}

export type ClmmOwnedPosition = {
  nftMint: string;
  poolId: string;
  pair: string;
  tickLower: number;
  tickUpper: number;
  liquidity: string;
};

export async function listClmmPositions(walletAddress: string, poolId?: string) {
  const wallet = publicKey(walletAddress, "Wallet");
  const { raydium } = await loadRaydium(wallet);
  const targetPools = poolId ? [assertAllowlistedPool(poolId)] : allowlistedPools.filter((pool) => pool.status === "verified");
  const positions: ClmmOwnedPosition[] = [];

  for (const poolSummary of targetPools) {
    const { poolInfo } = await raydium.clmm.getPoolInfoFromRpc(poolSummary.id);
    const owned = await raydium.clmm.getOwnerPositionInfo({ programId: poolInfo.programId });

    for (const position of owned) {
      if (!position.poolId.equals(new PublicKey(poolSummary.id))) continue;
      if (position.liquidity.isZero()) continue;

      positions.push({
        nftMint: position.nftMint.toBase58(),
        poolId: poolSummary.id,
        pair: poolSummary.pair,
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
        liquidity: position.liquidity.toString()
      });
    }
  }

  return positions;
}

export async function prepareClmmClosePosition(input: {
  wallet: string;
  poolId: string;
  positionNftMint: string;
  slippageBps?: number;
}) {
  const wallet = publicKey(input.wallet, "Wallet");
  const poolSummary = assertAllowlistedPool(input.poolId);
  const poolId = new PublicKey(poolSummary.id);
  const positionNftMint = publicKey(input.positionNftMint, "Position NFT mint");
  const slippageBps = input.slippageBps === undefined ? 50 : Math.floor(Number(input.slippageBps));

  const { rpcUrl, connection, raydium } = await loadRaydium(wallet);
  const { poolInfo } = await raydium.clmm.getPoolInfoFromRpc(poolId.toBase58());
  const ownerPosition = (await raydium.clmm.getOwnerPositionInfo({ programId: poolInfo.programId })).find((position) =>
    position.nftMint.equals(positionNftMint)
  );

  if (!ownerPosition) throw new Error("Position not owned by this wallet.");
  if (!ownerPosition.poolId.equals(poolId)) throw new Error("Position belongs to another pool.");
  if (ownerPosition.liquidity.isZero()) throw new Error("No liquidity to withdraw.");

  const amounts = await PoolUtils.getAmountsFromLiquidity({
    epochInfo: await connection.getEpochInfo(),
    poolInfo,
    tickLower: ownerPosition.tickLower,
    tickUpper: ownerPosition.tickUpper,
    liquidity: ownerPosition.liquidity,
    slippage: slippageBps / 10_000,
    add: false
  });

  const prepared = await raydium.clmm.decreaseLiquidity({
    poolInfo,
    ownerPosition,
    ownerInfo: { useSOLBalance: true, closePosition: true },
    liquidity: ownerPosition.liquidity,
    amountMinA: amounts.amountSlippageA.amount,
    amountMinB: amounts.amountSlippageB.amount,
    txVersion: TxVersion.V0,
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
    pair: poolSummary.pair,
    positionNftMint: positionNftMint.toBase58(),
    liquidity: ownerPosition.liquidity.toString(),
    minimumWithdrawal: {
      amountA: amounts.amountSlippageA.amount.toString(),
      amountB: amounts.amountSlippageB.amount.toString(),
      slippageBps
    },
    diagnostics,
    instructionTypes: prepared.instructionTypes,
    simulation
  };
}
