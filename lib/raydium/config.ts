import { getPoolById } from "@/lib/pools";

export function isRaydiumClmmEnabled() {
  return process.env.RAYDIUM_CLMM_ENABLED === "true" || process.env.RAYDIUM_CLMM_TEST_ENABLED === "true";
}

export function getRaydiumRpcUrl() {
  return process.env.SOLANA_RPC_URL ?? process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com";
}

export function getRaydiumMaxLamports() {
  return BigInt(process.env.RAYDIUM_CLMM_MAX_LAMPORTS ?? "10000000000");
}

export function assertAllowlistedPool(poolId: string) {
  const pool = getPoolById(poolId);
  if (!pool || pool.status !== "verified") {
    throw new Error("Pool not allowlisted.");
  }
  return pool;
}
