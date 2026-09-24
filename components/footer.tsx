"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowUp, 
  ArrowUpRight, 
  Check, 
  CheckCircle, 
  Copy, 
  DiscordLogo, 
  GithubLogo, 
  LockKey, 
  PaperPlaneTilt, 
  Pulse, 
  ShieldCheck, 
  Wallet, 
  XLogo 
} from "@phosphor-icons/react";
import { Brand } from "@/components/brand";

const SOCIAL_LINKS = {
  x: process.env.NEXT_PUBLIC_SOCIAL_X?.trim() || "",
  discord: process.env.NEXT_PUBLIC_SOCIAL_DISCORD?.trim() || "",
  github: process.env.NEXT_PUBLIC_SOCIAL_GITHUB?.trim() || "https://github.com/0x1933/keepx",
  solscan: "https://solscan.io/account/CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"
} as const;

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const copyProgramId = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText("CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK");
      setCopiedContract(true);
      setTimeout(() => setCopiedContract(false), 2500);
    }
  };

  return (
    <footer className="footer-v2" id="security">
      {/* Background Ambient Glow & Watermark */}
      <div className="footer-glow-backdrop" aria-hidden="true" />
      <div className="footer-watermark" aria-hidden="true">KEEPX</div>

      <div className="footer-v2-container">
        {/* Top Feature / Status Row */}
        <div className="footer-top-strip">
          <div className="footer-status-pill">
            <span className="pulse-dot" />
            <span className="status-label">Solana Mainnet-Beta</span>
            <span className="status-badge">100% Operational</span>
          </div>

          <div className="footer-contract-chip" onClick={copyProgramId} role="button" tabIndex={0} title="Click to copy Raydium CLMM Program ID">
            <span className="contract-label">Raydium CLMM Program:</span>
            <code className="contract-hash">CAMM...rWqK</code>
            <span className="copy-btn">
              {copiedContract ? <Check size={13} className="copy-success" /> : <Copy size={13} />}
            </span>
          </div>

          <div className="footer-audit-pill">
            <ShieldCheck size={16} weight="bold" />
            <span>Non-Custodial Architecture</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="footer-v2-grid">
          {/* Brand & Newsletter Column */}
          <div className="footer-v2-brand-col">
            <div className="footer-brand-header">
              <Brand />
              <p className="footer-mission">
                Precision concentrated liquidity on Solana. Direct Raydium SDK V2 execution with zero custodial risk.
              </p>
            </div>

            <form className="footer-subscribe-box" onSubmit={handleSubscribe}>
              <span className="subscribe-title">Join Keepx Insights</span>
              <p className="subscribe-desc">Weekly CLMM fee yield analysis, tick volatility reports, and alpha.</p>
              <div className="subscribe-input-group">
                <input
                  type="email"
                  placeholder="Enter wallet or email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="subscribe-input"
                />
                <button type="submit" className="subscribe-btn" aria-label="Subscribe">
                  {subscribed ? <Check size={16} weight="bold" /> : <PaperPlaneTilt size={16} weight="bold" />}
                </button>
              </div>
              {subscribed && (
                <span className="subscribe-success">
                  <CheckCircle size={14} weight="bold" /> Subscribed successfully to Keepx Insights!
                </span>
              )}
            </form>

            <div className="footer-socials">
              {SOCIAL_LINKS.x ? (
                <a href={SOCIAL_LINKS.x} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="X / Twitter">
                  <XLogo size={18} />
                </a>
              ) : null}
              {SOCIAL_LINKS.discord ? (
                <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Discord">
                  <DiscordLogo size={18} />
                </a>
              ) : null}
              {SOCIAL_LINKS.github ? (
                <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
                  <GithubLogo size={18} />
                </a>
              ) : null}
              <a href={SOCIAL_LINKS.solscan} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Raydium CLMM on Solscan">
                <Pulse size={18} />
              </a>
            </div>
          </div>

          {/* Navigation Column 1: Product */}
          <div className="footer-v2-nav-col">
            <h4 className="footer-col-heading">Product</h4>
            <ul className="footer-links-list">
              <li><Link href="/app">Launch Terminal</Link></li>
              <li><Link href="/markets">Allowlisted Markets</Link></li>
              <li><Link href="/positions">Position Manager</Link></li>
              <li><Link href="/activity">On-Chain Activity</Link></li>
              <li><Link href="/app">Yield Simulator</Link></li>
            </ul>
          </div>

          {/* Navigation Column 2: Developers & Docs */}
          <div className="footer-v2-nav-col">
            <h4 className="footer-col-heading">Developers & Docs</h4>
            <ul className="footer-links-list">
              <li><Link href="/docs">Architecture Overview</Link></li>
              <li><Link href="/docs">Raydium SDK V2 Boundary</Link></li>
              <li><Link href="/docs">Tick Alignment & Math</Link></li>
              <li><Link href="/docs">Non-Custodial Flow</Link></li>
              <li><Link href="/docs">Developer Quickstart</Link></li>
            </ul>
          </div>

          {/* Navigation Column 3: Security & Ecosystem */}
          <div className="footer-v2-nav-col">
            <h4 className="footer-col-heading">Security & Protocol</h4>
            <ul className="footer-links-list">
              <li>
                <span className="footer-link-tag">
                  <LockKey size={13} /> Non-Custodial
                </span>
              </li>
              <li>
                <span className="footer-link-tag">
                  <Wallet size={13} /> Wallet-First Signing
                </span>
              </li>
              <li>
                <a href="https://raydium.io" target="_blank" rel="noopener noreferrer" className="footer-external-link">
                  Raydium Protocol <ArrowUpRight size={13} />
                </a>
              </li>
              <li>
                <a href="https://solana.com" target="_blank" rel="noopener noreferrer" className="footer-external-link">
                  Solana Network <ArrowUpRight size={13} />
                </a>
              </li>
              <li>
                <Link href="/design-lab" className="footer-pill-link">
                  Design Lab UI
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-v2-bottom">
          <div className="footer-bottom-left">
            <span className="copyright-text">© 2026 Keepx. Built for Solana CLMM.</span>
            <div className="footer-legal-links">
              <Link href="/docs">Terms of Service</Link>
              <span className="dot-sep">·</span>
              <Link href="/docs">Privacy Policy</Link>
              <span className="dot-sep">·</span>
              <Link href="/docs">Risk Disclaimer</Link>
            </div>
          </div>

          <div className="footer-bottom-right">
            <button type="button" onClick={scrollToTop} className="back-to-top-btn" aria-label="Scroll back to top">
              <span>Back to top</span>
              <ArrowUp size={14} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
