# Raydium CLMM: Product Fit by Project Type

How CLMM **sits inside** each product category — what the user sees, where it lives, and what the implementation method handles vs what the product still builds.

---

## 1. DeFi / liquidity products

These are the **native home** for CLMM. Liquidity is the core job, not a side feature.

### LP dashboard

**Role:** Main product surface.

| Area | CLMM role |
|------|-----------|
| **Pool browser** | User picks SOL/USDC (or allowlisted pool) |
| **Open** | Range + deposit → method prepares open tx |
| **My positions** | List owned position NFTs → GET positions flow |
| **Close** | Select position → withdraw all + close account |

**User path:**  
`Pools` → `Open position` → (later) `My LP` → `Close position`

**Method covers:** open prepare, list, close prepare, sign/broadcast.  
**Product still builds:** pool list UI, charts, APR/fees display, range picker UX.

### Yield / liquidity page

**Role:** One focused “Earn” lane inside a broader DeFi app.

| Section | CLMM role |
|---------|-----------|
| Hero | “Provide liquidity on Raydium CLMM” |
| CTA | “Add liquidity” → open flow |
| Active positions | Cards with range, size, PnL estimate |
| Exit | “Withdraw & close” per card |

**User path:**  
`Earn` → `Add liquidity` → manage in `Active positions`

CLMM is usually **one strategy among others** (staking, lending, etc.), but on Raydium it’s the only way to LP in CLMM pools.

### Portfolio tool (positions + actions)

**Role:** **Read positions everywhere, act on CLMM positions here.**

| Tab | CLMM role |
|-----|-----------|
| Overview | Total LP value across positions |
| Positions | Filter “Raydium CLMM” |
| Detail | One position: range, tokens, fees (if fee collection is added later) |
| Actions | Open new / Close this position |

**User path:**  
`Portfolio` → `Positions` → click position → `Close` or `+ New CLMM position`

Portfolio apps often **aggregate**; CLMM is the **execution layer** when the user wants to change on-chain state.

---

## 2. Wallet-adjacent apps

CLMM is a **DeFi module**, not the wallet itself.

### Wallet / extension with DeFi tab

**Role:** Tab or screen: **Earn → Liquidity (Raydium CLMM)**.

```
Wallet home
  └── DeFi / Earn
        └── Liquidity
              ├── Open position   ← open flow
              └── My positions    ← list + close
```

**User path:** Connect wallet (already done) → `DeFi` → `Liquidity` → open or close.

**Fit:** Wallet already has Phantom, RPC, tx history — plug in prepare routes + a small panel. CLMM doesn’t replace send/receive; it **extends** the wallet with one DeFi primitive.

### “Earn” inside a broader Solana app (gaming, social, launchpad)

**Role:** Optional **monetization / retention** surface: “Put idle SOL to work.”

| Placement | CLMM role |
|-----------|-----------|
| Post-login dashboard | “Earn on your balance” card |
| Dedicated `/earn` | Full open/close UI |
| Token/collection page | “LP this pair” (only if pair matches allowlist) |

**User path:** User has SOL in connected wallet → discovers Earn → opens narrow-range LP → returns later to close.

**Caution:** Only add if the audience expects DeFi risk; keep copy clear on IL and irreversible close.

---

## 3. Trading / terminal-style apps

CLMM is **capital deployment**, not order entry.

### Apps that already connect Phantom and send txs

**Role:** New **module** next to swap / limit / perps.

Typical terminal layout:

```
Terminal
  ├── Trade (swap)
  ├── Liquidity (CLMM)     ← CLMM method
  │     ├── Open (pool + range + size)
  │     └── Positions (close)
  └── History
```

**User path:** Trader allocates capital → `Liquidity` → set range around current price → open → later close when range is wrong or they exit.

**Difference from swap:** Swap = one-shot trade. CLMM = **passive range position** until close.

### Pool + range + deposit + withdraw tools

**Role:** CLMM **is** the product logic; terminal chrome is wrapper.

| Control | Maps to API |
|---------|-------------|
| Pool selector | `poolId` (allowlisted) |
| Lower / upper price | open route body |
| Deposit amount | `baseAmountLamports` |
| Slippage | `slippageBps` (close) |
| Position dropdown | GET positions |
| Withdraw & close | POST close |

**User path:** Power user workflow — minimal marketing, maximum controls + diagnostics (size, signers, sim), similar to Method Finder’s panel.

---

## 4. Treasury / ops tools (careful)

CLMM supports **self-custody ops**, not automated treasury without multisig design.

### DAO / team managing their own LP

**Role:** **Treasury action**: “Deploy treasury SOL/USDC into CLMM” / “Exit LP.”

| Screen | CLMM role |
|--------|-----------|
| Treasury dashboard | Show CLMM positions as one asset line |
| Propose (off-chain) | Snapshot + range + amount in forum/Discord |
| Execute (on-chain) | Multisig member or designated signer uses open/close UI |

**User path:**  
Governance decides range → signer connects **treasury wallet** (or personal if wrong model) → prepare → sign → broadcast.

**Important:** The reference flow is **single Phantom signer**. For real DAO treasury you often need **Squads / multisig** — CLMM prepare still works; signing step changes.

### Internal admin / liquidity ops panel

**Role:** **Operator console** for a small team’s LP (testnet/mainnet with caps).

| Feature | CLMM role |
|---------|-----------|
| Env-gated routes | `RAYDIUM_CLMM_ENABLED`, pool allowlist, max lamports |
| Open test position | Small size, verify signer layout |
| List + close | Clean up test positions |
| Diagnostics | Tx size, sim, instruction types (Method Finder style) |

**User path:** Engineer/ops connects test wallet → open small position → verify → close.

This is how Method Finder uses it today: **signer-warning / integration lab**, not retail UX.

---

## Summary: CLMM “position” in the product

| Project type | Where CLMM lives | Primary user action |
|--------------|------------------|---------------------|
| LP dashboard | Core pages | Open & close LP |
| Yield page | Earn section | Add / exit liquidity |
| Portfolio | Positions + detail | View & close (open optional) |
| Wallet DeFi tab | Earn → Liquidity | Open & close |
| Broader app Earn | Optional module | Idle capital → LP |
| Trading terminal | Liquidity tab | Deploy range capital |
| Range/deposit tool | Main workflow | Full LP lifecycle |
| DAO treasury | Treasury → LP ops | Governed open/close |
| Internal ops | Admin / lab | Test & monitor txs |

---

## What the implementation gives vs what each project still builds

**Implementation method provides:**

- Server prepare (open + close)
- List positions
- Prepare → preview → broadcast
- Simulation + signer diagnostics

**Each product still adds:**

- **Placement** (which page — skill asks before coding)
- Pool discovery / branding
- Charts, APR, price range UX
- Position PnL / fees (optional)
- Multisig if treasury
- Risk copy (IL, slippage, irreversible close)

---

## Related docs

- [raydium-clmm-positions.md](./raydium-clmm-positions.md) — implementation brief
- [raydium-clmm-open-position.md](./raydium-clmm-open-position.md) — open detail
- [raydium-clmm-close-position.md](./raydium-clmm-close-position.md) — close detail
- Global skill: `raydium-clmm-positions`
