export const raydiumMethodChecklist = [
  "fetchPoolById for mainnet pool metadata",
  "getPoolInfoFromRpc for direct pool state",
  "getOwnerPositionInfo for connected wallet CLMM positions",
  "openPositionFromBase or openPositionFromLiquidity for creating positions",
  "decreaseLiquidity before close when liquidity remains",
  "closePosition only after verifying fee/reward handling"
];
