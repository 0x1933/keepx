# Raydium Integration Notes

Use `@raydium-io/raydium-sdk-v2` through isolated modules. The connected wallet remains the signing identity.

Verify current SDK source before wiring:

- `fetchPoolById`
- `getPoolInfoFromRpc`
- `getOwnerPositionInfo`
- `openPositionFromBase`
- `openPositionFromLiquidity`
- tick/price conversion helpers
- liquidity calculations
- `decreaseLiquidity`
- collect fee and reward flows
- `closePosition`

No SDK method should be invented. Transaction signing stays client-wallet controlled.
