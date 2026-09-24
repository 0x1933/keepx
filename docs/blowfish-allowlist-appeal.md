# Blowfish / Phantom allowlist appeal — keepx.link

**Status:** Ready to send by the project owner from their official identity.  
**Do not send from a personal/throwaway address** — use the project domain email or the GitHub org owner if possible.

## Where to send

| Channel | Address / link |
|--------|----------------|
| Blowfish (primary) | `review@blowfish.xyz` |
| Phantom (cc / companion) | `review@phantom.com` |
| Phantom domain docs | https://docs.phantom.com/developer-powertools/domain-and-transaction-warnings |
| Fast-track vouch | Ask a known Solana developer to DM **@blowfishxyz** on X |

Also scan the domain yourself before/after:

- https://blowfish.xyz
- https://dappsentry.com (multi-provider check)
- Confirm absence from https://github.com/phantom/blocklist (`blocklist.yaml`) — as of 2026-09-01, `keepx.link` is **not** listed (flag is Blowfish automated, not the static YAML).

---

## Suggested email subject

```
False positive allowlist request — keepx.link (Raydium CLMM terminal)
```

## Suggested email body (copy/paste and fill [BRACKETS])

```
Hello Blowfish / Phantom Trust & Safety,

We are requesting an allowlist review for a false-positive "Request blocked / This dApp could be malicious" flag on:

  Domain: https://keepx.link

Phantom is hard-blocking wallet connect and sign requests on this domain. The domain does not appear in the public phantom/blocklist YAML — this looks like an automated Blowfish scanner false positive.

### What Keepx is
Keepx is a non-custodial Solana web terminal for creating, simulating, monitoring, and closing Raydium CLMM concentrated-liquidity positions. The server prepares transactions with the official Raydium SDK v2; the user's wallet signs and sends. We never request, store, or transmit private keys or seed phrases.

### On-chain program we interact with
Raydium CLMM (public, audited protocol):
  CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK

We only allowlist verified Raydium pools (SOL/USDC, SOL/USDT, JUP/SOL, mSOL/SOL, etc.). Pool mint pairs are re-verified against on-chain state before prepare.

### Proof of legitimate behavior (successful open-position tx)
https://solscan.io/tx/aa6XyFNXFiT7kpK1aePomRci7ZiVoBYEABtgVWo1ZfWZ9QeGgC2nX3Lgq3mQggG4pNaXaSzDY3KmciqUE5We6VX

Programs in that transaction:
- CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK (Raydium CLMM)
- TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA (SPL Token)
- ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL (Associated Token)
- metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s (Metaplex — position NFT metadata)
- System Program + ComputeBudget

There is no SystemProgram.transfer to a third-party attacker address. Position NFT rent and liquidity remain under the signer's wallet.

### Why this is not a drainer
1. All txs are built by @raydium-io/raydium-sdk-v2 (openPositionFromBase / decreaseLiquidity).
2. No custom SystemProgram.transfer to team wallets.
3. No signAllTransactions; single-signer flow only.
4. No private-key / seed handling; non-custodial wallet-adapter only.
5. Pools must be allowlisted; deposit amounts are capped server-side.
6. Server simulates with sigVerify:false before the user is asked to approve.
7. We now use wallet-adapter sendTransaction (Phantom native signAndSendTransaction) rather than raw signTransaction + sendRawTransaction.

### Source / identity
- Source: https://github.com/0x1933/keepx
- Production: https://keepx.link
- X / Twitter: [FILL]
- Discord: [FILL]
- Contact email: [FILL]
- Team / GitHub profiles: [FILL]

### Request
Please allowlist https://keepx.link (and www if applicable) so Phantom/Blowfish stop hard-blocking connect and sign requests. Happy to provide more sample signatures, a screen recording of the flow, or a live walkthrough.

Thank you,
[NAME]
[ROLE] — Keepx
```

---

## Owner checklist after sending

1. Fill socials / contact in the email and set `NEXT_PUBLIC_SOCIAL_X` / `NEXT_PUBLIC_SOCIAL_DISCORD` in production env, then redeploy.
2. Deploy the `sendTransaction` signing refactor from this repo before or right after the appeal (reduces re-flag risk).
3. Ask a known Solana developer (not an influencer) to vouch via X DM to @blowfishxyz.
4. Reply to Blowfish's auto-ack with any ticket number and extra evidence they request.
5. After they confirm allowlisting, re-test on Phantom desktop + mobile:
   - Connect wallet on https://keepx.link
   - Prepare + approve open position
   - Prepare + approve close
   - Confirm no "Request blocked" screen
6. Optional: if the hard block remains after a week despite allowlisting, consider migrating to a more reputable TLD (`.fun` weighs against new-domain heuristics).

## Verification notes (2026-09-01)

| Check | Result |
|-------|--------|
| Live site HTTPS | PASS (`https://keepx.link` → 200, Cloudflare, Next.js) |
| In `phantom/blocklist` `blocklist.yaml` | NOT FOUND (other `*.fun` phishing domains exist; not this one) |
| Flag type | Blowfish automated hard block ("Request blocked") |
| Sample tx programs | Legitimate Raydium CLMM open-position stack |
