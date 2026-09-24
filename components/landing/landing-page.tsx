"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { 
  ArrowRight, 
  ArrowsClockwise, 
  ChartLineUp, 
  Check, 
  Coins, 
  Cpu, 
  Lightning, 
  LockKey, 
  Pulse, 
  ShieldCheck, 
  Sliders, 
  Sparkle, 
  Wallet 
} from "@phosphor-icons/react";
import { Brand } from "@/components/brand";
import { Footer } from "@/components/footer";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

const howStepsData = [
  {
    num: "01",
    title: "Connect Your Wallet",
    short: "Non-custodial cryptographic signing identity",
    desc: "The wallet is the signing identity. Keepx never asks for custody, secret keys, or fund delegation.",
    badge: "Non-Custodial"
  },
  {
    num: "02",
    title: "Choose a CLMM Market",
    short: "Select verified pools with explicit tick intervals",
    desc: "Start from an allowlisted Raydium CLMM pool with verified liquidity depth, volume, and exact tick spacing.",
    badge: "Allowlisted Pools"
  },
  {
    num: "03",
    title: "Set Range & Simulate",
    short: "Align tick bounds & verify pre-flight execution",
    desc: "Set lower and upper bounds, align ticks mathematically to pool spacing, and simulate the transaction before signing.",
    badge: "Tick-Aligned Math"
  },
  {
    num: "04",
    title: "Monitor & Exit",
    short: "Track range health, harvest fees, or rebalance",
    desc: "Inspect active position health, track real-time fee accrual, and execute instant withdrawals or range rebalancing.",
    badge: "Instant Execution"
  }
];

const heroMarkets = [
  ["SOL / USDC", "$186.24", "24.8%", "$2,341", "$168.00", "$204.00"],
  ["SOL / USDT", "$186.31", "22.1%", "$1,892", "$170.00", "$202.00"],
  ["JUP / SOL", "0.00842", "36.7%", "$3,142", "0.00720", "0.00980"],
  ["mSOL / SOL", "1.0682", "18.4%", "$1,283", "1.0200", "1.1200"],
  ["BTC / SOL", "558.21", "41.2%", "$5,842", "520.00", "600.00"],
  ["SOL / USDC", "$186.18", "23.9%", "$2,204", "$169.00", "$201.00"],
  ["JUP / SOL", "0.00838", "32.1%", "$2,881", "0.00740", "0.00940"],
  ["SOL / USDT", "$186.27", "21.6%", "$1,764", "$171.00", "$200.00"]
];

function HeroProductBoard() {
  return (
    <div className="hero-board" aria-label="Keepx market preview">
      <div className="board-topline">
        <Brand />
        <span><i /> In range</span>
      </div>
      <div className="board-grid">
        {heroMarkets.map(([pair, price, apr, fees, lower, upper], index) => (
          <article className="market-tile" key={`${pair}-${index}`}>
            <div className="token-row">
              <span className="token-stack"><i /><i /></span>
              <span className="range-pill"><b /> In range</span>
            </div>
            <h3>{pair}</h3>
            <strong>{price}</strong>
            <div className="tile-stats">
              <span>APR <b>{apr}</b></span>
              <span>Fees <b>{fees}</b></span>
            </div>
            <div className="range-values">
              <span>Lower <b>{lower}</b></span>
              <span>Upper <b>{upper}</b></span>
            </div>
            <div className="mini-slider"><i /><b /><b /></div>
            <div className="tile-actions">
              <Link href={`/app?pair=${encodeURIComponent(pair)}`} className="tile-btn">Frame</Link>
              <Link href={`/app?pair=${encodeURIComponent(pair)}&simulate=true`} className="tile-btn secondary">Simulate</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

const rangePresets = [
  { label: "±3% Ultra-Tight", lower: -3, upper: 3, mult: "16.6x", apr: "84.2%" },
  { label: "±6% Focused", lower: -6, upper: 6, mult: "8.3x", apr: "48.6%" },
  { label: "±12% Balanced", lower: -12, upper: 12, mult: "4.1x", apr: "28.4%" },
  { label: "±20% Wide", lower: -20, upper: 20, mult: "2.5x", apr: "18.2%" }
];

/* Step 1 Visual Mockup */
function WalletStageVisual() {
  return (
    <div className="stage-mockup-wrapper">
      <div className="mockup-wallet-grid">
        <div className="mockup-wallet-pill active">
          <Wallet size={24} className="text-blue-400" />
          <span>Phantom</span>
          <span className="text-[10px] text-emerald-400 font-mono font-bold">CONNECTED</span>
        </div>
        <div className="mockup-wallet-pill">
          <Wallet size={24} className="text-slate-400" />
          <span>Solflare</span>
          <span className="text-[10px] text-slate-500 font-mono">Available</span>
        </div>
        <div className="mockup-wallet-pill">
          <Wallet size={24} className="text-slate-400" />
          <span>Backpack</span>
          <span className="text-[10px] text-slate-500 font-mono">Available</span>
        </div>
      </div>
      <div className="mockup-wallet-status">
        <div className="flex items-center gap-2">
          <span className="pulse-dot" />
          <span className="text-xs text-slate-300">Authority Address:</span>
          <code className="text-xs text-blue-400 font-mono font-bold">7xKp8...9aL2</code>
        </div>
        <span className="text-xs text-emerald-400 flex items-center gap-1">
          <ShieldCheck size={14} /> Non-Custodial
        </span>
      </div>
    </div>
  );
}

/* Step 2 Visual Mockup */
function MarketStageVisual() {
  return (
    <div className="stage-mockup-wrapper">
      <div className="mockup-market-list">
        <div className="mockup-market-row selected">
          <div className="flex items-center gap-2">
            <strong className="text-sm text-white">SOL / USDC</strong>
            <span className="mono text-xs text-blue-400 font-semibold">$186.24</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="mono text-xs px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded">0.04% Fee</span>
            <span className="text-xs text-emerald-400 font-mono font-bold">24.8% APR</span>
          </div>
        </div>

        <div className="mockup-market-row">
          <div className="flex items-center gap-2">
            <strong className="text-sm text-white">JUP / SOL</strong>
            <span className="mono text-xs text-slate-400">0.00842</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="mono text-xs px-2 py-0.5 bg-white/5 border border-white/10 text-slate-400 rounded">0.25% Fee</span>
            <span className="text-xs text-emerald-400 font-mono font-bold">36.7% APR</span>
          </div>
        </div>

        <div className="mockup-market-row">
          <div className="flex items-center gap-2">
            <strong className="text-sm text-white">BTC / SOL</strong>
            <span className="mono text-xs text-slate-400">558.21</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="mono text-xs px-2 py-0.5 bg-white/5 border border-white/10 text-slate-400 rounded">0.05% Fee</span>
            <span className="text-xs text-emerald-400 font-mono font-bold">41.2% APR</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Step 3 Visual Mockup */
function FrameStageVisual() {
  return (
    <div className="stage-mockup-wrapper">
      <div className="mockup-frame-box">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span>Lower Bound: <b className="text-white font-mono">$175.06 (-6%)</b></span>
          <span>Upper Bound: <b className="text-white font-mono">$197.41 (+6%)</b></span>
        </div>

        <div className="mockup-range-preview-bar">
          <div className="mockup-range-active-zone" />
          <div className="mockup-current-price-marker" />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-blue-400 font-mono font-bold flex items-center gap-1">
            <Sparkle size={13} /> 8.3x Capital Density Boost
          </span>
          <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
            <Lightning size={13} /> Pre-Sign Simulation: PASSED
          </span>
        </div>
      </div>
    </div>
  );
}

/* Step 4 Visual Mockup */
function MonitorStageVisual() {
  return (
    <div className="stage-mockup-wrapper">
      <div className="mockup-monitor-grid">
        <div className="mockup-metric-tile">
          <small>Position Value</small>
          <strong>$1,332.58 USD</strong>
        </div>
        <div className="mockup-metric-tile">
          <small>Unclaimed Fees</small>
          <strong className="text-emerald-400">+$28.45 USDC</strong>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-300 mb-3">
        <span>Composition: <b>54% SOL / 46% USDC</b></span>
        <span className="text-emerald-400 font-semibold flex items-center gap-1">
          <Pulse size={12} weight="bold" /> 99.4% In-Range Time
        </span>
      </div>

      <div className="flex gap-2">
        <button type="button" className="btn secondary text-xs py-1.5 px-3 flex-1 flex items-center justify-center gap-1.5">
          <Coins size={14} /> Harvest Fees
        </button>
        <button type="button" className="btn text-xs py-1.5 px-3 flex-1 flex items-center justify-center gap-1.5">
          <ArrowsClockwise size={14} /> Rebalance Frame
        </button>
      </div>
    </div>
  );
}

export function LandingPage() {
  const storyRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(1);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"]
  });
  const panelY = useTransform(scrollYProgress, [0, 0.26], [0, reduced ? 0 : -80]);
  const panelOpacity = useTransform(scrollYProgress, [0, 0.26], [1, 0.74]);

  useMotionValueEvent(storyProgress, "change", (latest) => {
    const calculatedStep = Math.min(howStepsData.length - 1, Math.max(0, Math.floor(latest * howStepsData.length)));
    setActiveStep(calculatedStep);
  });

  const basePrice = 186.24;
  const currentPreset = rangePresets[selectedPresetIndex];
  const calculatedLower = (basePrice * (1 + currentPreset.lower / 100)).toFixed(2);
  const calculatedUpper = (basePrice * (1 + currentPreset.upper / 100)).toFixed(2);

  const stepVisuals = [
    <WalletStageVisual key="wallet" />,
    <MarketStageVisual key="market" />,
    <FrameStageVisual key="frame" />,
    <MonitorStageVisual key="monitor" />
  ];

  return (
    <main className="site-shell">
      {/* Navigation */}
      <nav className="landing-nav">
        <Brand />
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#product">Product</a>
          <Link href="/markets">Markets</Link>
          <Link href="/docs">Docs</Link>
        </div>
        <div className="nav-actions">
          <Link className="btn" href="/app">Launch App <ArrowRight size={16} weight="bold" /></Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div>
          <motion.div className="hero-badge" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <LockKey size={15} /> Non-custodial · Raydium CLMM · Solana
          </motion.div>
          <h1 className="hero-title">
            <span className="hero-line hero-top">
              <span className="hero-word">Keep</span>
              <span className="inline-orbit"><LockKey size={46} weight="bold" /></span>
              <span className="hero-word">Liquidity.</span>
            </span>
            <span className="hero-line hero-bottom">
              <span className="hero-word">Own</span>
              <span className="inline-orbit"><Pulse size={44} weight="bold" /></span>
              <span className="hero-word">the Edge.</span>
            </span>
          </h1>
          <p className="hero-copy">
            Create, simulate, sign, monitor, and exit concentrated liquidity positions without giving up wallet custody.
          </p>
          <div className="hero-actions">
            <Link className="btn" href="/app">Launch App <ArrowRight size={16} /></Link>
            <a className="btn secondary" href="#how">How it works</a>
          </div>
        </div>
        <motion.div className="hero-product" style={{ y: panelY, opacity: panelOpacity }}>
          <ContainerScroll>
            <HeroProductBoard />
          </ContainerScroll>
        </motion.div>
      </section>

      {/* Enhanced Interactive How It Works Section */}
      <section className="scroll-story" id="how" ref={storyRef}>
        <div className="story-sticky">
          <div className="story-copy">
            <h2>How It Works</h2>
            <p>Four steps from zero to an on-chain concentrated liquidity position.</p>
            
            {/* Minimalist Horizontal Dash Step List */}
            <div className="story-dash-list">
              {howStepsData.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button
                    key={step.num}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={`story-dash-item ${isActive ? "active" : ""}`}
                  >
                    <span className="story-dash-line" />
                    <span className="story-dash-text">{step.num} · {step.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Stage Card with Motion */}
          <div className="story-stage">
            <div className="stage-ambient-glow" />
            <AnimatePresence mode="wait">
              <motion.article
                className="story-stage-card"
                key={howStepsData[activeStep].num}
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="stage-card-header">
                  <span className="stage-step-tag">Step {howStepsData[activeStep].num} / 04</span>
                  <span className="stage-badge-pill">{howStepsData[activeStep].badge}</span>
                </div>
                <h3 className="stage-card-title">{howStepsData[activeStep].title}</h3>
                <p className="stage-card-desc">{howStepsData[activeStep].desc}</p>
                
                {/* Dynamic Visual Mockup Component */}
                {stepVisuals[activeStep]}
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Telemetry Stats Strip */}
      <section className="telemetry-strip-section" aria-label="System telemetry stats">
        <div className="telemetry-strip">
          <div className="telemetry-item">
            <span className="telemetry-label">Framed Volume</span>
            <span className="telemetry-value">$148.4M+</span>
            <span className="telemetry-sub"><ChartLineUp size={14} /> +32% this month</span>
          </div>
          <div className="telemetry-item">
            <span className="telemetry-label">Capital Efficiency</span>
            <span className="telemetry-value">8.3x - 24x</span>
            <span className="telemetry-sub"><Sparkle size={14} /> vs Classic AMM</span>
          </div>
          <div className="telemetry-item">
            <span className="telemetry-label">Simulation Latency</span>
            <span className="telemetry-value">&lt; 118ms</span>
            <span className="telemetry-sub"><Lightning size={14} /> Real-time RPC</span>
          </div>
          <div className="telemetry-item">
            <span className="telemetry-label">Protocol Surcharge</span>
            <span className="telemetry-value">0.00%</span>
            <span className="telemetry-sub"><Check size={14} /> 100% Direct SDK</span>
          </div>
        </div>
      </section>

      {/* Bottom Showcase CTA Section with Interactive Sandbox */}
      <section className="bottom-showcase-section" id="product">
        <div className="bottom-cta-banner">
          <div className="bottom-cta-grid">
            <div className="cta-left-copy">
              <span className="cta-eyebrow-pill">
                <Sparkle size={14} weight="bold" /> Concentrated Liquidity Precision
              </span>
              <h2 className="cta-title">
                The range is the <span className="gradient-text">product</span>.
              </h2>
              <p className="cta-desc">
                Concentrated liquidity delivers 10x-50x capital efficiency over classic AMMs. Keepx gives you total command of bounds, slippage, and simulation before your wallet signs.
              </p>

              <div className="cta-pills-row">
                <span className="cta-pill-item"><ShieldCheck size={14} /> Non-Custodial</span>
                <span className="cta-pill-item"><Sliders size={14} /> Tick-Aligned</span>
                <span className="cta-pill-item"><Cpu size={14} /> Raydium V2 Direct</span>
              </div>

              <div className="cta-actions">
                <Link className="btn" href="/app">
                  Open Terminal <ArrowRight size={16} weight="bold" />
                </Link>
                <Link className="btn secondary" href="/docs">
                  Read Architecture Docs
                </Link>
              </div>
            </div>

            {/* Interactive Live Range Sandbox */}
            <div className="cta-sandbox-card">
              <div className="sandbox-header">
                <div className="sandbox-pair">
                  <strong>SOL / USDC</strong>
                  <span className="price">${basePrice.toFixed(2)}</span>
                </div>
                <span className="sandbox-badge">
                  <Pulse size={12} weight="bold" /> In Range
                </span>
              </div>

              <div className="sandbox-controls">
                <div className="filter-pills-group" style={{ marginBottom: 4 }}>
                  {rangePresets.map((preset, idx) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setSelectedPresetIndex(idx)}
                      className={selectedPresetIndex === idx ? "filter-btn active" : "filter-btn"}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="sandbox-slider-row">
                  <div className="slider-label-row">
                    <span>Lower Price Bound ({currentPreset.lower}%)</span>
                    <b>${calculatedLower}</b>
                  </div>
                  <div className="sandbox-range-bar">
                    <div
                      className="sandbox-range-active"
                      style={{
                        left: `${Math.max(5, 50 + currentPreset.lower * 1.8)}%`,
                        right: `${Math.max(5, 50 - currentPreset.upper * 1.8)}%`
                      }}
                    />
                    <div className="sandbox-price-ticker" style={{ left: "50%" }} />
                  </div>
                  <div className="slider-label-row">
                    <span>Upper Price Bound (+{currentPreset.upper}%)</span>
                    <b>${calculatedUpper}</b>
                  </div>
                </div>
              </div>

              <div className="sandbox-stats-grid">
                <div className="sandbox-stat-item">
                  <small>Capital Density</small>
                  <strong>{currentPreset.mult} Boost</strong>
                </div>
                <div className="sandbox-stat-item">
                  <small>Estimated Fee APR</small>
                  <strong>~{currentPreset.apr}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Quad Grid */}
      <section className="feature-quad-section">
        <div className="feature-quad-grid">
          <div className="feature-quad-card">
            <div className="feature-icon-orb"><Sliders size={22} weight="bold" /></div>
            <h3>Mathematical Precision</h3>
            <p>Direct Raydium SDK V2 tick-spacing alignment prevents off-curve rounding drift and slippage losses.</p>
          </div>
          <div className="feature-quad-card">
            <div className="feature-icon-orb"><ShieldCheck size={22} weight="bold" /></div>
            <h3>Zero-Custody Guarantee</h3>
            <p>Transactions are assembled entirely in your browser. Private keys never leave your Solana wallet adapter.</p>
          </div>
          <div className="feature-quad-card">
            <div className="feature-icon-orb"><Pulse size={22} weight="bold" /></div>
            <h3>Live Telemetry & Alerts</h3>
            <p>Monitor position range health, impermanent loss risk, and pending fee accruals with millisecond updates.</p>
          </div>
          <div className="feature-quad-card">
            <div className="feature-icon-orb"><ArrowsClockwise size={22} weight="bold" /></div>
            <h3>One-Click Rebalancing</h3>
            <p>Quickly withdraw out-of-range liquidity and deploy into new high-volume price bands in one atomic flow.</p>
          </div>
        </div>
      </section>

      {/* Shared High-End Footer */}
      <Footer />
    </main>
  );
}
