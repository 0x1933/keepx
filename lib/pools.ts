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

export const allowlistedPools: PoolSummary[] = [
  {
    id: "2QdhepnKRTLjjSqPL1PtKNwqrUkoLee5Gqs8bvZhRdMv",
    pair: "SOL / USDC",
    baseSymbol: "SOL",
    quoteSymbol: "USDC",
    baseMint: "So11111111111111111111111111111111111111112",
    quoteMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    feeTier: "0.04%",
    tickSpacing: 10,
    currentPrice: 186.24,
    apr: "24.8%",
    tvlUsd: 48200000,
    volume24hUsd: 14200000,
    status: "verified"
  },
  {
    id: "Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE",
    pair: "SOL / USDT",
    baseSymbol: "SOL",
    quoteSymbol: "USDT",
    baseMint: "So11111111111111111111111111111111111111112",
    quoteMint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY1LLB7EX8X8HYJ",
    feeTier: "0.04%",
    tickSpacing: 10,
    currentPrice: 186.31,
    apr: "22.1%",
    tvlUsd: 29400000,
    volume24hUsd: 8900000,
    status: "verified"
  },
  {
    id: "7XawhbbxtsRcQA8KTkHT9f9nc6d69UwqCDh6U5EEbEmX",
    pair: "JUP / SOL",
    baseSymbol: "JUP",
    quoteSymbol: "SOL",
    baseMint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    quoteMint: "So11111111111111111111111111111111111111112",
    feeTier: "0.25%",
    tickSpacing: 60,
    currentPrice: 0.00842,
    apr: "36.7%",
    tvlUsd: 18400000,
    volume24hUsd: 6400000,
    status: "verified"
  },
  {
    id: "6a37aby12SbToBTQcqL4hH7nJ7yFm2Yx3d31vKqW53Uq",
    pair: "mSOL / SOL",
    baseSymbol: "mSOL",
    quoteSymbol: "SOL",
    baseMint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    quoteMint: "So11111111111111111111111111111111111111112",
    feeTier: "0.01%",
    tickSpacing: 2,
    currentPrice: 1.0682,
    apr: "18.4%",
    tvlUsd: 31200000,
    volume24hUsd: 3900000,
    status: "verified"
  },
  {
    id: "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2",
    pair: "BTC / SOL",
    baseSymbol: "BTC",
    quoteSymbol: "SOL",
    baseMint: "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh",
    quoteMint: "So11111111111111111111111111111111111111112",
    feeTier: "0.05%",
    tickSpacing: 10,
    currentPrice: 558.21,
    apr: "41.2%",
    tvlUsd: 21500000,
    volume24hUsd: 5800000,
    status: "verified"
  }
];

export function getPoolById(id: string) {
  return allowlistedPools.find((pool) => pool.id === id);
}
