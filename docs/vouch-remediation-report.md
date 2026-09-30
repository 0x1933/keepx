# Keepx remediation note for vouch review

**Date:** 28 September 2026  
**Commit:** [`3a03d8b`](https://github.com/0x1933/keepx/commit/3a03d8b) on `main`  
**Repo:** https://github.com/0x1933/keepx  
**Production:** https://keepx.link  

This note summarizes what changed after the security/legitimacy review that withheld a personal vouch. It is intended to help a reviewer decide whether the deployed build is now vouchable — not as a claim that Phantom/Blowfish have already cleared the domain.

## Bottom line

The endorsement blockers called out in the review were addressed in source and pushed to GitHub. Keepx remains a non-custodial Raydium CLMM frontend: the server prepares transactions; the user’s wallet must approve. No seed/private-key collection was introduced. A separate unpublished SOL-transfer page was removed rather than republished.

A vouch should still be based on reviewing this commit (or the matching production deploy) plus, ideally, a small open → discover → close demonstration on that deploy.

## What was fixed

| Review ID | Issue | Remediation |
| --- | --- | --- |
| KX-01 | Production `/trasnf3r` missing from published source | Route and panel deleted; gitignore exclusions removed. Do not republish. Confirm production returns 404 after redeploy. |
| KX-02 | Fabricated balances/activity presented as live | Activity, portfolio metrics, charts, and example positions labeled as **Demo**. Invalid Solscan “proof” links removed. |
| KX-03 | Four of five “verified” pools wrong | Allowlist reduced to one independently verified Raydium CLMM pool: **SOL/USDC** `2QdhepnKRTLjjSqPL1PtKNwqrUkoLee5Gqs8bvZhRdMv` (fee tier corrected to **0.05%**). |
| KX-04 | Default position discovery failed | Per-pool decode failures isolated; CLMM owner/size gate before SDK decode. Sample wallet now lists its known position on the unfiltered path. Positions UI distinguishes error vs empty. |
| KX-05 | Failed on-chain execution shown as success | `confirmTransaction` result checked; `value.err` throws instead of reporting success. |
| KX-06 | Failed simulation still “prepared” | Open/close prepare throws on simulation error (API 422). Approve requires a fresh successful prepare. |
| KX-07 | Prepared tx could diverge from UI intent | Reset on wallet/RPC/input changes; request-generation guards discard stale responses. Approve disabled until prepared. |
| KX-08 | Signing summary understated spend | Open response exposes `otherAmountMax` / symbols; signing UI shows base deposit + other-token max + prepared range. Copy no longer claims cost is only NFT rent. |
| KX-09 | Weak slippage/range validation | Slippage bounded (1–5000 bps); prices must be positive and ordered. |
| KX-10 | Visit telemetry undisclosed | Query strings stripped from visit reports; privacy note added under `/docs`. |
| KX-11 | Open RPC proxy | Method allowlist, body size limit, upstream timeout. |
| KX-13 | Appeal overclaimed safety | [`docs/blowfish-allowlist-appeal.md`](../docs/blowfish-allowlist-appeal.md) rewritten: no “confirmed false positive,” no “all txs Raydium SDK,” no “single-signer only,” one verified pool, transfer route removed. |

## Verification already run on this commit

- `yarn test` — pass (including confirmation-error and slippage/allowlist checks)
- `yarn typecheck` — pass
- Read-only discovery smoke for wallet `Dg2DGNXstmNxxJMBJwtTXAzK2bWqvG5AXuUci2AMjuTR`: returned position NFT `73oja8kzjwr46jEVmz2dKMiUZrFwnDwjEHHKtuQUTUZR` on SOL/USDC with no pool errors

## What a vouch can currently say

Defensible language after checking the deploy matches `3a03d8b`:

> I reviewed Keepx source after the remediation commit. It is a non-custodial Raydium CLMM terminal for one verified SOL/USDC pool. The unpublished transfer route was removed. Demo financial UI is labeled as demo. Prepare rejects failed simulations; confirmation errors are not reported as success. Position discovery works for the previously failing sample wallet. I did not find seed-phrase collection or an unexplained attacker payment path in the reviewed money path. I am willing to vouch for a Phantom/Blowfish domain review of this build.

## What remains outside this remediation

These were explicitly out of scope or still need operator evidence:

1. **Production must match the commit** — rebuild/redeploy and confirm `/trasnf3r` is gone.
2. **Funded open → discover → close** on the exact candidate deploy (reviewer-controlled small test).
3. **Dependency advisories (KX-12)** — Yarn audit findings remain; not mass-upgraded in this pass.
4. **Live portfolio/activity feeds** — still demo-labeled static UI by design for this pass.
5. **Phantom/Blowfish ticket outcome** — an allowlist decision is theirs; this note does not assert a false positive has already been proven.

## Suggested quick re-check for the vouching developer

1. Diff or browse commit `3a03d8b` (especially `lib/pools.ts`, `prepare-open.ts`, `prepare-close.ts`, `clmm-wallet.ts`, signing/close panels).
2. On production after redeploy: `https://keepx.link/trasnf3r` → expect **404**.
3. Connect the sample (or your) wallet on `/positions` and confirm discovery + close prepare UI.
4. Optionally walk a tiny open on SOL/USDC and close it; keep Solscan links.
5. If comfortable, vouch via the channel Phantom/Blowfish currently use — using the corrected appeal draft, not the old overclaiming version.

## Key references

- Remediation commit: https://github.com/0x1933/keepx/commit/3a03d8b  
- Sample prior open tx (pre-remediation evidence of ordinary CLMM deposit): https://solscan.io/tx/aa6XyFNXFiT7kpK1aePomRci7ZiVoBYEABtgVWo1ZfWZ9QeGgC2nX3Lgq3mQggG4pNaXaSzDY3KmciqUE5We6VX  
- Corrected appeal draft: https://github.com/0x1933/keepx/blob/main/docs/blowfish-allowlist-appeal.md  
- Verified pool: `2QdhepnKRTLjjSqPL1PtKNwqrUkoLee5Gqs8bvZhRdMv` (Raydium CLMM SOL/USDC)
