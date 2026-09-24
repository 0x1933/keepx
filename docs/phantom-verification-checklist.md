# Post-allowlist verification checklist — keepx.link

Use this after Blowfish/Phantom confirm the domain is allowlisted **and** the signing refactor is deployed to production.

## Local / CI verification (completed 2026-09-01)

| Check | Result |
|-------|--------|
| No remaining `signTransaction` + `sendRawTransaction` path | PASS |
| Open/close UI uses wallet-adapter `sendTransaction` | PASS |
| Extra "Preview in wallet" bare-sign removed | PASS |
| `metadataBase` → `https://keepx.link` | PASS |
| Footer socials from env (GitHub defaults to 0x1933/keepx) | PASS |
| Unit tests | PASS (5/5) |
| `npm run typecheck` | PASS (after PageProps fix) |
| `npm run build` | Run after install |

## Phantom live verification (owner — after allowlist)

Desktop extension and mobile:

1. Open https://keepx.link in a clean browser profile.
2. Connect Phantom — expect **no** "Request blocked" screen.
3. Go to `/app`, prepare a small open-position tx on an allowlisted pool, approve once in Phantom.
4. Confirm Solscan shows Raydium CLMM program `CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK`.
5. Go to `/positions`, prepare close, approve once — expect no hard block.
6. If a soft "new domain" caution remains briefly, that is normal per [Phantom docs](https://docs.phantom.com/developer-powertools/domain-and-transaction-warnings) and usually clears after review.

## If still blocked after appeal

1. Reply on the Blowfish ticket with the new sample signature after deploy.
2. Confirm a known Solana developer vouched via @blowfishxyz.
3. As a last resort, migrate off `.fun` to a higher-reputation TLD and re-appeal.
