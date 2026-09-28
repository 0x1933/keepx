import { getPoolById } from "@/lib/pools";

const MIN_SLIPPAGE_BPS = 1;
const MAX_SLIPPAGE_BPS = 5000;

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

export function parseSlippageBps(value: unknown, fallback = 50) {
  const raw = value === undefined || value === null || value === "" ? fallback : Number(value);
  if (!Number.isFinite(raw)) throw new Error("Slippage must be a finite number.");
  const bps = Math.floor(raw);
  if (bps < MIN_SLIPPAGE_BPS || bps > MAX_SLIPPAGE_BPS) {
    throw new Error(`Slippage must be between ${MIN_SLIPPAGE_BPS} and ${MAX_SLIPPAGE_BPS} bps.`);
  }
  return bps;
}
