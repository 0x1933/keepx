# Keepx Architecture

## Product Shape

Keepx has a public kinetic landing page and a signed-in app workspace. `Launch App` routes to `/app`, where the user selects an allowlisted Raydium CLMM pool, frames a price range, enters deposit settings, captures a signing snapshot, and walks through transaction states.

## Modules

- `lib/pools.ts`: allowlisted Raydium CLMM pool metadata
- `lib/range.ts`: tested range health, tick display, and composition helpers
- `lib/transactions.ts`: tested transaction lifecycle reducer
- `lib/positions.ts`: normalized position shape for UI and future chain data
- `lib/raydium/client.ts`: server-only Raydium/Solana import boundary
- `lib/supabase/schema.sql`: preferences, activity, and presets schema

## Production Rule

On-chain Raydium state is authoritative. Supabase stores preferences, presets, snapshots, and activity only.
