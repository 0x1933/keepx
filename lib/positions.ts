import { allowlistedPools } from "./pools";

export type PositionSummary = {
  id: string;
  poolId: string;
  nftMint: string;
  lowerPrice: number;
  upperPrice: number;
  currentPrice: number;
  liquidityUsd: number;
  tokenA: number;
  tokenB: number;
  state: "IN_RANGE" | "BELOW_RANGE" | "ABOVE_RANGE";
  unclaimedFees: string;
};

export const demoPositions: PositionSummary[] = [
  {
    id: "RF-SOL-184",
    poolId: allowlistedPools[0].id,
    nftMint: "F9mK...x2Pa",
    lowerPrice: 172,
    upperPrice: 198.5,
    currentPrice: 184.26,
    liquidityUsd: 922.4,
    tokenA: 54,
    tokenB: 46,
    state: "IN_RANGE",
    unclaimedFees: "Unavailable"
  },
  {
    id: "RF-SOL-210",
    poolId: allowlistedPools[0].id,
    nftMint: "9sQk...L81d",
    lowerPrice: 188,
    upperPrice: 210,
    currentPrice: 184.26,
    liquidityUsd: 410.18,
    tokenA: 100,
    tokenB: 0,
    state: "BELOW_RANGE",
    unclaimedFees: "Unavailable"
  }
];
