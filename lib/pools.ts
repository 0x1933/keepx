import { z } from "zod";

export const poolSchema = z.object({
  id: z.string().min(32),
  pair: z.string(),
  baseSymbol: z.string(),
  quoteSymbol: z.string(),
  baseMint: z.string(),
  quoteMint: z.string(),
  feeTier: z.string(),
  tickSpacing: z.number().int().positive(),
  currentPrice: z.number().positive(),
  apr: z.string().optional(),
  tvlUsd: z.number().nullable(),
  volume24hUsd: z.number().nullable(),
  status: z.enum(["verified", "unavailable"])
});

export type PoolSummary = z.infer<typeof poolSchema>;

/** Only independently verified Raydium CLMM pools. Static APR/TVL/volume are illustrative demo figures. */
export const allowlistedPools: PoolSummary[] = [
  {
    id: "2QdhepnKRTLjjSqPL1PtKNwqrUkoLee5Gqs8bvZhRdMv",
    pair: "SOL / USDC",
    baseSymbol: "SOL",
    quoteSymbol: "USDC",
    baseMint: "So11111111111111111111111111111111111111112",
    quoteMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    feeTier: "0.05%",
    tickSpacing: 10,
    currentPrice: 186.24,
    apr: "24.8%",
    tvlUsd: 48200000,
    volume24hUsd: 14200000,
    status: "verified"
  }
];

export function getPoolById(id: string) {
  return allowlistedPools.find((pool) => pool.id === id);
}
