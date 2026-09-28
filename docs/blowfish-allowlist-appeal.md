# Blowfish / Phantom domain review request — keepx.link

**Status:** Draft for the project owner after deploying the remediation build.  
**Do not claim a confirmed false positive.** Request a review with current evidence.  
**Do not send from a personal/throwaway address** — use the project domain email or the GitHub org owner if possible.

## Where to send

| Channel | Address / link |
|--------|----------------|
| Blowfish (primary) | `review@blowfish.xyz` |
| Phantom (cc / companion) | `review@phantom.com` |
| Phantom domain docs | https://docs.phantom.com/developer-powertools/domain-and-transaction-warnings |
| Fast-track vouch | Ask a known Solana developer to DM **@blowfishxyz** on X only after they have reviewed the deployed build |

Also scan the domain yourself before/after:

- https://blowfish.xyz
- https://dappsentry.com (multi-provider check)
- Confirm presence/absence from https://github.com/phantom/blocklist (`blocklist.yaml`)

---

## Suggested email subject

```
Domain review request — keepx.link (Raydium CLMM terminal)
```

## Suggested email body (copy/paste and fill [BRACKETS])

```
Hello Blowfish / Phantom Trust & Safety,

We are requesting a domain/transaction-warning review for:

  Domain: https://keepx.link

Phantom has been showing a hard block / malicious dApp warning on connect or sign. We are not asserting that this is already proven to be a false positive; we are asking for a review of the current deployed application and the evidence below.

### What Keepx is
Keepx is a non-custodial Solana web app for preparing, simulating, and closing Raydium CLMM concentrated-liquidity positions. Server APIs prepare transactions with the official Raydium SDK v2; the user's wallet must approve and send. We do not request, store, or transmit private keys or seed phrases.

### On-chain program we interact with
Raydium CLMM (public protocol):
  CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK

We currently allowlist one independently verified Raydium CLMM pool (SOL/USDC):
  2QdhepnKRTLjjSqPL1PtKNwqrUkoLee5Gqs8bvZhRdMv

Pool mint pairs are re-verified against on-chain state before prepare. A separate SOL transfer page previously present in production has been removed from the application.

### Proof of legitimate CLMM open behavior (sample tx)
https://solscan.io/tx/aa6XyFNXFiT7kpK1aePomRci7ZiVoBYEABtgVWo1ZfWZ9QeGgC2nX3Lgq3mQggG4pNaXaSzDY3KmciqUE5We6VX

Programs in that transaction:
- CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK (Raydium CLMM)
- TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA (SPL Token)
- ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL (Associated Token)
- metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s (Metaplex — position NFT metadata)
- System Program + ComputeBudget

There is no unexplained SystemProgram.transfer to a third-party attacker address in that sample. The open flow may include a second required signer for a freshly generated position-NFT mint keypair in addition to the user's wallet.

### Controls in the current build
1. CLMM open/close transactions are built by @raydium-io/raydium-sdk-v2 (openPositionFromBase / decreaseLiquidity).
2. No project custody of user keys; wallet-adapter only.
3. Allowlisted pool(s) only; deposit amounts are capped server-side.
4. Failed simulations reject preparation; on-chain confirmation errors are not reported as success.
5. Signing UI discloses base deposit and other-token maximum before approval.
6. We use wallet-adapter sendTransaction (Phantom native sign-and-send when available).

### Source / identity
- Source: https://github.com/0x1933/keepx
- Production: https://keepx.link
- Deployed revision / commit: [FILL AFTER DEPLOY]
- X / Twitter: [FILL]
- Discord: [FILL]
- Contact email: [FILL]
- Team / GitHub profiles: [FILL]

### Request
Please review https://keepx.link under your current domain and transaction-warning process. Happy to provide more sample signatures, a screen recording of open → discover → close, or a live walkthrough.

Thank you,
[NAME]
[ROLE] — Keepx
```

---

## Owner checklist after sending

1. Fill socials / contact and set `NEXT_PUBLIC_SOCIAL_X` / `NEXT_PUBLIC_SOCIAL_DISCORD` in production env, then redeploy.
2. Deploy this remediation build before or with the review request.
3. Ask a known Solana developer to vouch only after they review the deployed source and a complete open/close flow.
4. Reply to Blowfish's auto-ack with any ticket number and extra evidence they request.
5. After any allowlisting, re-test on Phantom desktop + mobile:
   - Connect wallet on https://keepx.link
   - Prepare + approve open position
   - Discover + prepare + approve close
   - Confirm the warning behavior matches Phantom's documentation for new domains vs transaction simulation
6. Optional: if a new-domain warning remains, consider a longer-lived reputable TLD; that alone does not prove safety.

## Verification notes

| Check | Result |
|-------|--------|
| Sample tx programs | Consistent with Raydium CLMM open-position stack |
| Allowlist | Single verified SOL/USDC CLMM pool in current source |
| Transfer route | Removed from application source |
| Dependency advisories | Residual Yarn audit findings may remain; treat as separate hygiene work |
