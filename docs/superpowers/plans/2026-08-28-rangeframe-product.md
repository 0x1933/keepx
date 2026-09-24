# Keepx Product Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Keepx as a Solana Raydium CLMM product where users connect a wallet, choose an allowlisted pool, frame liquidity, preview/simulate, sign, monitor, and exit.

**Architecture:** Next.js App Router renders the public kinetic landing and app routes. Raydium SDK V2 logic stays behind `lib/raydium`, wallet signing remains client-side, and Supabase stores only preferences, presets, snapshots, and activity.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Motion, Solana wallet adapter, `@solana/web3.js`, `@raydium-io/raydium-sdk-v2`, TanStack Query, Zod, Supabase.

## Global Constraints

- Product name is Keepx.
- Palette uses the Modern Minimal dark blue system.
- No background images.
- Landing uses kinetic center text and coded product preview panels.
- `Launch App` must route into the product workspace.
- No private keys or seed phrases.
- No fake APY, fake PnL, or fake TVL.
- On-chain Raydium state is authoritative.

---

### Task 1: Product Shell

**Files:**
- Create: `components/landing/landing-page.tsx`
- Create: `components/app/app-nav.tsx`
- Modify: `app/page.tsx`
- Create: `app/app/page.tsx`

**Status:** Complete.

- [x] Add kinetic landing page.
- [x] Add working `Launch App` route.
- [x] Add app navigation.
- [x] Add responsive product preview.

### Task 2: Domain Model

**Files:**
- Create: `lib/pools.ts`
- Create: `lib/range.ts`
- Create: `lib/positions.ts`
- Create: `lib/transactions.ts`
- Test: `tests/range.test.ts`
- Test: `tests/transactions.test.ts`

**Status:** Complete.

- [x] Add allowlisted pool model.
- [x] Add range health calculations.
- [x] Add transaction lifecycle reducer.
- [x] Add tests.

### Task 3: App Pages

**Files:**
- Create: `app/markets/page.tsx`
- Create: `app/positions/page.tsx`
- Create: `app/positions/[position]/page.tsx`
- Create: `app/activity/page.tsx`
- Create: `app/docs/page.tsx`

**Status:** Complete.

- [x] Add markets page.
- [x] Add positions page.
- [x] Add position detail.
- [x] Add activity.
- [x] Add docs route.

### Task 4: Real Raydium Execution

**Files:**
- Modify: `lib/raydium/client.ts`
- Create: `lib/raydium/pools.ts`
- Create: `lib/raydium/positions.ts`
- Create: `lib/raydium/open-position.ts`
- Create: `lib/raydium/close-position.ts`
- Create: `app/api/pools/route.ts`
- Create: `app/api/positions/route.ts`
- Create: `app/api/tx/simulate/route.ts`

**Status:** Pending.

- [ ] Verify `fetchPoolById` against installed SDK types.
- [ ] Verify `getPoolInfoFromRpc` against installed SDK types.
- [ ] Verify `getOwnerPositionInfo` against installed SDK types.
- [ ] Build typed normalized pool fetch.
- [ ] Build typed owner-position fetch.
- [ ] Build unsigned open-position transaction builder.
- [ ] Simulate transaction through Solana RPC.
- [ ] Request wallet signature on the client.
- [ ] Broadcast and confirm.
- [ ] Refresh positions after confirmation.

### Task 5: Supabase Persistence

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Modify: `lib/supabase/schema.sql`
- Create: `app/api/activity/route.ts`
- Create: `app/api/presets/route.ts`

**Status:** Pending.

- [ ] Apply RLS policies.
- [ ] Store range presets by wallet.
- [ ] Store confirmed Keepx-originating activity.
- [ ] Store signing snapshot metadata.

### Task 6: Production Hardening

**Files:**
- Modify: `docs/security.md`
- Modify: `docs/ship-checklist.md`

**Status:** Pending.

- [ ] Audit dependencies.
- [ ] Add wallet error states.
- [ ] Add RPC failure states.
- [ ] Add simulation failure mapping.
- [ ] Add production environment documentation.
