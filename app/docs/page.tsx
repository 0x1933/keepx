"use client";

import { useState } from "react";
import { 
  BookOpen, 
  Check, 
  CheckCircle, 
  Copy, 
  Cpu, 
  Lightning, 
  LockKey, 
  ShieldCheck, 
  Sliders, 
  TerminalWindow, 
  Wallet 
} from "@phosphor-icons/react";
import { AppNav } from "@/components/app/app-nav";
import { Footer } from "@/components/footer";

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

function CodeSnippet({ code, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="code-box">
      <div className="code-header">
        <span>{filename || language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs hover:text-white transition-colors cursor-pointer bg-transparent border-0 text-slate-400"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check size={14} className="text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

const sections = [
  { id: "overview", label: "Overview & Architecture", icon: BookOpen },
  { id: "non-custodial", label: "Non-Custodial Flow", icon: ShieldCheck },
  { id: "raydium-checklist", label: "Raydium SDK V2 Boundary", icon: Cpu },
  { id: "tick-math", label: "Tick Alignment & Math", icon: Sliders },
  { id: "quickstart", label: "Developer Quickstart", icon: TerminalWindow },
  { id: "security-model", label: "Security & Audits", icon: LockKey }
];

const raydiumMethods = [
  {
    name: "fetchPoolById",
    signature: "raydium.clmm.getPoolInfoFromRpc(poolId: string)",
    purpose: "Fetches live on-chain pool metadata, current tick index, square root price, fee growth globals, and active tick spacing directly from Solana RPC."
  },
  {
    name: "getPoolInfoFromRpc",
    signature: "raydium.clmm.getRpcClmmPoolInfo({ poolId })",
    purpose: "Extracts atomic tick arrays and pool state required to compute accurate lower and upper boundary liquidity equations."
  },
  {
    name: "getOwnerPositionInfo",
    signature: "raydium.clmm.getOwnerPositionInfo({ poolId })",
    purpose: "Scans the connected wallet's token accounts to retrieve all position NFT mints, locked liquidity amounts, and accrued unclaimed fees."
  },
  {
    name: "openPositionFromBase",
    signature: "raydium.clmm.openPositionFromBase({ poolInfo, tickLower, tickUpper, baseAmount })",
    purpose: "Constructs the exact concentrated liquidity position instructions, computing necessary token transfers and NFT mint allocation."
  },
  {
    name: "decreaseLiquidity",
    signature: "raydium.clmm.decreaseLiquidity({ poolInfo, positionInfo, liquidity })",
    purpose: "Generates atomic withdrawal instructions to unlock principal liquidity and collect accrued fee tokens back to the signer's wallet."
  },
  {
    name: "closePosition",
    signature: "raydium.clmm.closePosition({ poolInfo, positionInfo })",
    purpose: "Burns the position NFT, returns rent exemption lamports to the owner wallet, and finalizes closure on-chain."
  }
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="app-shell">
      <AppNav />

      <div className="docs-shell">
        <header className="docs-hero">
          <h1>Keepx Protocol Docs</h1>
          <p>
            The technical guide and developer reference for Keepx. Learn how concentrated liquidity positions are framed, tick-aligned, simulated, and executed directly on Raydium CLMM.
          </p>
        </header>

        <div className="docs-layout">
          {/* Sticky Navigation Sidebar */}
          <aside className="docs-sidebar">
            <span className="sidebar-title">Documentation Guide</span>
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => scrollToSection(sec.id)}
                  className={activeSection === sec.id ? "docs-nav-link active" : "docs-nav-link"}
                >
                  <span className="flex items-center gap-2">
                    <Icon size={16} />
                    <span>{sec.label}</span>
                  </span>
                </button>
              );
            })}
          </aside>

          {/* Main Docs Content */}
          <article className="docs-content">
            {/* Section 1: Overview */}
            <section id="overview" className="doc-section-card">
              <h2>
                <BookOpen size={24} className="text-blue-400" />
                Overview & Architecture
              </h2>
              <p>
                Keepx is a high-performance concentrated liquidity (CLMM) management suite engineered for Solana. Traditional Automated Market Makers (x × y = k) disperse capital uniformly across the entire price curve from zero to infinity. Concentrated liquidity allows liquidity providers (LPs) to allocate capital inside specific price intervals ([P_lower, P_upper]), yielding up to <strong>50x greater fee efficiency</strong>.
              </p>

              <div className="doc-callout">
                <ShieldCheck size={20} className="shrink-0 text-blue-400" />
                <div>
                  <strong>Pure Client-Side Isolation:</strong> Keepx operates strictly client-side. The application fetches RPC pool state directly from Solana, calculates tick indices, and builds transactions in your browser for local wallet signing.
                </div>
              </div>

              <CodeSnippet
                filename="architecture-flow.md"
                language="markdown"
                code={`[Solana RPC] <---> [Keepx App (Browser)] <---> [Solana Wallet Adapter]
       |                      |                                |
  Live Tick Array       Pre-Flight Simulation           Phantom / Solflare
   & Pool Metadata      & Slippage Guard               Local Transaction Sign`}
              />
            </section>

            {/* Section 2: Non-Custodial Flow */}
            <section id="non-custodial" className="doc-section-card">
              <h2>
                <ShieldCheck size={24} className="text-emerald-400" />
                Non-Custodial Signing Pipeline
              </h2>
              <p>
                Every transaction crafted by Keepx requires explicit approval and signing by the user’s connected Solana wallet. Keepx never holds, routes, or proxies user funds.
              </p>
              <p>
                The execution lifecycle follows four strict boundaries:
              </p>

              <div className="method-checklist-grid">
                <div className="method-checklist-card">
                  <span className="method-tag"><Wallet size={16} /> 01. Wallet Connection</span>
                  <p>Wallet adapter authenticates the public key as the position authority. No custodial permissions requested.</p>
                </div>
                <div className="method-checklist-card">
                  <span className="method-tag"><Sliders size={16} /> 02. Boundary Calculation</span>
                  <p>Selected price bounds are snapped to valid Raydium tick spacings to ensure mathematical accuracy.</p>
                </div>
                <div className="method-checklist-card">
                  <span className="method-tag"><Lightning size={16} /> 03. Pre-Flight Simulation</span>
                  <p>The transaction is simulated against the latest Solana slot to verify balance constraints and compute fee estimation.</p>
                </div>
                <div className="method-checklist-card">
                  <span className="method-tag"><CheckCircle size={16} /> 04. On-Chain Confirmation</span>
                  <p>Transaction is broadcasted via high-speed RPC and verified via block commitment logs.</p>
                </div>
              </div>
            </section>

            {/* Section 3: Raydium SDK V2 Boundary */}
            <section id="raydium-checklist" className="doc-section-card">
              <h2>
                <Cpu size={24} className="text-blue-400" />
                Raydium SDK V2 Boundary & Methods
              </h2>
              <p>
                Keepx leverages the official <code>@raydium-io/raydium-sdk-v2</code> library. To ensure fault isolation, all SDK operations are encapsulated inside dedicated handler services.
              </p>

              <div className="method-checklist-grid">
                {raydiumMethods.map((method) => (
                  <div key={method.name} className="method-checklist-card">
                    <span className="method-tag">{method.name}()</span>
                    <code className="text-xs text-slate-400 font-mono">{method.signature}</code>
                    <p>{method.purpose}</p>
                  </div>
                ))}
              </div>

              <CodeSnippet
                filename="raydium-position-init.ts"
                language="typescript"
                code={`import { Raydium, ClmmPoolInfo } from "@raydium-io/raydium-sdk-v2";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

export async function openRangePosition({
  raydium,
  poolInfo,
  tickLower,
  tickUpper,
  baseAmount,
}: {
  raydium: Raydium;
  poolInfo: ClmmPoolInfo;
  tickLower: number;
  tickUpper: number;
  baseAmount: BN;
}) {
  // Construct CLMM position instructions
  const { execute, transaction } = await raydium.clmm.openPositionFromBase({
    poolInfo,
    tickLower,
    tickUpper,
    baseAmount,
    otherAmountMax: new BN(0),
    checkCreateATAOwner: true,
  });

  return { execute, transaction };
}`}
              />
            </section>

            {/* Section 4: Tick Alignment Math */}
            <section id="tick-math" className="doc-section-card">
              <h2>
                <Sliders size={24} className="text-purple-400" />
                Concentrated Liquidity & Tick Math
              </h2>
              <p>
                In Raydium CLMM, prices are represented logarithmically as discrete tick intervals. The relationship between price P and tick index i is governed by:
              </p>

              <div className="doc-callout">
                <div>
                  <strong>Tick Price Formula:</strong><br />
                  <code className="text-sm font-mono">P(i) = 1.0001^i</code>
                </div>
              </div>

              <p>
                Each pool enforces a specific <code>tickSpacing</code> (e.g. 10, 60, 120). Any arbitrary price selected by a user must be snapped to the nearest multiple of <code>tickSpacing</code>:
              </p>

              <CodeSnippet
                filename="tick-alignment.ts"
                language="typescript"
                code={`export function alignTickToSpacing(tick: number, spacing: number): number {
  const remainder = tick % spacing;
  if (remainder === 0) return tick;
  return remainder >= spacing / 2 ? tick + (spacing - remainder) : tick - remainder;
}

export function priceToTick(price: number): number {
  return Math.floor(Math.log(price) / Math.log(1.0001));
}`}
              />
            </section>

            {/* Section 5: Developer Quickstart */}
            <section id="quickstart" className="doc-section-card">
              <h2>
                <TerminalWindow size={24} className="text-cyan-400" />
                Developer Quickstart
              </h2>
              <p>
                Clone the repository and initialize the development server locally to test framing simulations against Solana devnet or mainnet-beta.
              </p>

              <CodeSnippet
                filename="terminal"
                language="bash"
                code={`# Clone the repository
git clone https://github.com/0x1933/keepx.git
cd keepx

# Install dependencies
npm install

# Run the local development server
npm run dev

# Run unit tests and type checks
npm run test
npm run typecheck`}
              />
            </section>

            {/* Section 6: Security Model */}
            <section id="security-model" className="doc-section-card">
              <h2>
                <LockKey size={24} className="text-amber-400" />
                Security Model & Risk Disclaimers
              </h2>
              <p>
                Providing concentrated liquidity involves price exposure and impermanent loss risk if market prices exit your selected range.
              </p>
              <ul>
                <li><strong>Impermanent Loss:</strong> If the price of Token A falls below your lower range, your position will convert 100% into Token A.</li>
                <li><strong>No Fee Earnings Out of Range:</strong> While market price is outside your framed interval, the position does not accrue trading fees.</li>
                <li><strong>Non-Custodial Smart Contract Safety:</strong> All funds are deposited into verified Raydium CLMM program accounts (`CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK`).</li>
              </ul>
            </section>
          </article>
        </div>
      </div>

      <Footer />
    </main>
  );
}
