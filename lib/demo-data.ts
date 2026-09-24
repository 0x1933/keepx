export const market = {
  id: "sol-usdc",
  pair: "SOL / USDC",
  base: "SOL",
  quote: "USDC",
  poolType: "Raydium CLMM",
  poolAddress: "2QdhepnKRTLjjSqPL1PtKNwqrUkoLee5Gqs8bvZhRdMv",
  baseMint: "So11111111111111111111111111111111111111112",
  quoteMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  currentPrice: 184.26,
  lowerPrice: 172,
  upperPrice: 198.5,
  feeTier: "0.04%",
  tickSpacing: 10,
  tickPriceSpacing: 0.05,
  tvl: "Unavailable",
  volume: "Unavailable",
  depositSol: 0.03,
  counterpartUsdc: 461.2,
  slippage: 0.5,
  wallet: "8xF2...91Qa",
  network: "Mainnet UI demo"
};

export const positions = [
  {
    id: "RF-1842",
    market: "SOL / USDC",
    state: "IN RANGE",
    lower: 172,
    upper: 198.5,
    current: 184.26,
    liquidity: "$922.40",
    composition: "54% SOL / 46% USDC",
    fees: "Unavailable",
    value: "$922.40",
    distance: "6.7% to lower"
  },
  {
    id: "RF-1290",
    market: "SOL / USDC",
    state: "BELOW RANGE",
    lower: 188,
    upper: 210,
    current: 184.26,
    liquidity: "$410.18",
    composition: "100% SOL",
    fees: "Unavailable",
    value: "$410.18",
    distance: "2.0% below lower"
  },
  {
    id: "RF-2207",
    market: "SOL / USDC",
    state: "ABOVE RANGE",
    lower: 140,
    upper: 178,
    current: 184.26,
    liquidity: "$1,204.77",
    composition: "100% USDC",
    fees: "Unavailable",
    value: "$1,204.77",
    distance: "3.4% above upper"
  }
];

export const transactionStages = [
  "Building",
  "Simulating",
  "Ready to sign",
  "Awaiting wallet",
  "Submitted",
  "Confirming",
  "Confirmed"
];
