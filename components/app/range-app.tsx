"use client";

import { useMemo, useReducer, useState } from "react";
import { motion } from "motion/react";
import { Gauge, Pulse, ShieldCheck } from "@phosphor-icons/react";
import { CandlestickChart } from "@/components/charts/candlestick-chart";
import { Candlestick } from "@/components/charts/candlestick";
import { ComposedChart } from "@/components/charts/composed-chart";
import { FunnelChart } from "@/components/charts/funnel-chart";
import { Grid } from "@/components/charts/grid";
import { Line } from "@/components/charts/line";
import { SeriesBar } from "@/components/charts/series-bar";
import { allowlistedPools } from "@/lib/pools";
import { demoPositions } from "@/lib/positions";
import { calculateCounterpartAmount, deriveFrameHealth, deriveTokenComposition } from "@/lib/range";
import { transactionReducer } from "@/lib/transactions";
import { ClmmSigningPanel } from "@/components/app/clmm-signing-panel";

const candles = [
  [8, 62, 53, 69, 48], [14, 54, 58, 63, 50], [20, 58, 51, 65, 47], [26, 52, 61, 66, 49],
  [32, 62, 71, 76, 58], [38, 70, 67, 78, 63], [44, 66, 75, 80, 62], [50, 76, 83, 88, 70],
  [56, 84, 78, 90, 74], [62, 78, 72, 84, 68], [68, 72, 64, 77, 60], [74, 63, 69, 72, 58],
  [80, 69, 73, 79, 65], [86, 73, 66, 78, 62], [92, 66, 71, 75, 61]
];
const chartData = Array.from({ length: 22 }, (_, index) => ({
  date: new Date(2026, 7, index + 1),
  open: 148 + Math.sin(index * 0.7) * 8 + index * 0.8,
  high: 156 + Math.sin(index * 0.62) * 10 + index * 0.9,
  low: 140 + Math.cos(index * 0.5) * 7 + index * 0.65,
  close: 150 + Math.sin(index * 0.86) * 10 + index * 0.82,
  liquidity: 48 + Math.sin(index * 0.42) * 16 + index * 1.8,
  fees: 12 + Math.cos(index * 0.5) * 4 + index * 0.55,
  price: 148 + Math.sin(index * 0.35) * 12 + index * 1.1
}));

const funnelData = [
  { label: "Build", value: 100, displayValue: "100%" },
  { label: "Simulate", value: 92, displayValue: "92%" },
  { label: "Sign", value: 78, displayValue: "78%" },
  { label: "Confirm", value: 71, displayValue: "71%" }
];

export function RangeApp() {
  const [poolId, setPoolId] = useState(allowlistedPools[0].id);
  const pool = allowlistedPools.find((item) => item.id === poolId) ?? allowlistedPools[0];
  const [lower, setLower] = useState(171);
  const [upper, setUpper] = useState(199);
  const [deposit, setDeposit] = useState(0.03);
  const [slippage, setSlippage] = useState(0.5);
  const [stage, dispatch] = useReducer(transactionReducer, "idle");

  const health = useMemo(() => deriveFrameHealth({ currentPrice: pool.currentPrice, lowerPrice: lower, upperPrice: upper }), [pool.currentPrice, lower, upper]);
  const composition = useMemo(() => deriveTokenComposition({ currentPrice: pool.currentPrice, lowerPrice: lower, upperPrice: upper }), [pool.currentPrice, lower, upper]);
  const counterpart = calculateCounterpartAmount(deposit, pool.currentPrice);

  const pricePath = [18, 28, 24, 42, 36, 56, 50, 63, 58, 74, 66, 70, 61, 68, 59, 72, 64, 77, 69, 73];

  return (
    <main className="app-main" id="main-app">
      <motion.section
        className="command-strip"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <Metric label="Portfolio value" value="$1,332.58" />
        <Metric label="Active positions" value="2" />
        <Metric label="In range" value="1" />
        <Metric label="Unclaimed fees" value="+$34.18 USD" />
      </motion.section>

      <motion.div
        className="terminal-grid"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.aside className="panel pool-panel" variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } }}>
          <div className="panel-title"><ShieldCheck size={17} /> Allowlisted pools</div>
          <div className="market-list">
            {allowlistedPools.map((item) => (
              <button className={item.id === poolId ? "market-item active" : "market-item"} key={item.id} onClick={() => setPoolId(item.id)}>
                <strong>{item.pair}</strong>
                <span>{item.feeTier} · tick spacing {item.tickSpacing}</span>
                <small>{item.id.slice(0, 8)}...{item.id.slice(-6)}</small>
              </button>
            ))}
          </div>
          <div className="pool-facts">
            <Metric label="Base mint" value={`${pool.baseMint.slice(0, 4)}...${pool.baseMint.slice(-4)}`} />
            <Metric label="Quote mint" value={`${pool.quoteMint.slice(0, 4)}...${pool.quoteMint.slice(-4)}`} />
            <Metric label="Pool TVL" value={pool.tvlUsd ? `$${(pool.tvlUsd / 1_000_000).toFixed(1)}M` : "$48.2M"} />
          </div>
        </motion.aside>

        <motion.section className="panel range-console" variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } }}>
          <div className="builder-top">
            <div>
              <span className="eyebrow">Range builder</span>
              <h1 className="mono">{pool.pair}</h1>
              <p>Current price {pool.currentPrice.toFixed(2)} {pool.quoteSymbol}. The selected range is aligned visually before transaction construction.</p>
            </div>
            <button className="btn secondary" onClick={() => { setLower(172); setUpper(198.5); dispatch({ type: "RESET" }); }}>Reset range</button>
          </div>

          <div className="chart-shell">
            <div className="chart-head"><span>Price context</span><strong className="mono">{pool.currentPrice.toFixed(2)}</strong></div>
            <svg className="market-chart" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polyline points="0,78 8,72 14,74 20,66 26,69 32,58 38,61 44,48 50,54 56,39 62,45 68,51 74,47 80,55 86,49 94,56 100,52" />
              {candles.map(([x, open, close, high, low], index) => (
                <g key={index} className={close > open ? "up" : "down"}>
                  <line x1={x} x2={x} y1={100 - high} y2={100 - low} />
                  <rect x={x - 1.2} y={100 - Math.max(open, close)} width="2.4" height={Math.max(3, Math.abs(close - open))} rx="0.5" />
                </g>
              ))}
            </svg>
            <div className="chart-bars" aria-hidden="true">
              {pricePath.map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
            </div>
            <motion.div className="range-band" initial={{ scaleX: 0.7, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ duration: 0.7 }}>
              <button className="range-handle lower" onClick={() => setLower((value) => Number((value - 0.5).toFixed(2)))}>{lower.toFixed(2)}</button>
              <button className="range-handle upper" onClick={() => setUpper((value) => Number((value + 0.5).toFixed(2)))}>{upper.toFixed(2)}</button>
            </motion.div>
            <i className="spot-line"><span>{pool.currentPrice.toFixed(2)}</span></i>
          </div>

          <div className="builder-controls">
            <label className="field"><span>Lower price</span><input value={lower} onChange={(e) => setLower(Number(e.target.value))} type="number" /></label>
            <label className="field"><span>Upper price</span><input value={upper} onChange={(e) => setUpper(Number(e.target.value))} type="number" /></label>
            <label className="field">
              <span>Deposit {pool.baseSymbol}</span>
              <input
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                type="number"
                min={0.001}
                step={0.001}
              />
            </label>
          </div>

          <section className="frame-health-board">
            <Metric label="Range health" value={health.label} />
            <Metric label="Lower edge" value={`${health.distanceToLowerPct.toFixed(1)}%`} />
            <Metric label="Upper edge" value={`${health.distanceToUpperPct.toFixed(1)}%`} />
            <Metric label="Composition" value={`${composition.tokenA}% ${pool.baseSymbol} / ${composition.tokenB}% ${pool.quoteSymbol}`} />
            <Metric label="Counterpart" value={`${counterpart.toFixed(2)} USDC`} />
            <Metric label="Range width" value={`${health.rangeWidthPct.toFixed(1)}%`} />
          </section>
        </motion.section>

        <motion.aside className="panel signing-panel" variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } }}>
          <ClmmSigningPanel
            pool={pool}
            lower={lower}
            upper={upper}
            deposit={deposit}
            slippage={slippage}
            onSlippageChange={setSlippage}
            stage={stage}
            dispatch={dispatch}
          />
        </motion.aside>
      </motion.div>

      <motion.section className="lower-grid" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-120px" }} transition={{ duration: 0.6 }}>
        <div className="panel">
          <div className="panel-title"><Gauge size={17} /> Active positions</div>
          <div className="position-stack">
            {demoPositions.map((position) => (
              <article className="position-row" key={position.id}>
                <strong>{position.id}</strong>
                <span className="mono">{position.lowerPrice.toFixed(2)} / {position.upperPrice.toFixed(2)}</span>
                <span className={position.state === "IN_RANGE" ? "status in" : "status out"}>{position.state.replace("_", " ")}</span>
                <span>{position.tokenA}% SOL / {position.tokenB}% USDC</span>
              </article>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-title"><Pulse size={17} /> Range behavior</div>
          <p>Outside the active range, liquidity shifts entirely into one token and stops earning swap fees until price returns inside the bounds.</p>
          <div className="behavior-map">
            <span>SOL only</span>
            <strong>Mixed liquidity</strong>
            <span>USDC only</span>
          </div>
        </div>
      </motion.section>

      <motion.section className="chart-grid-panel" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-120px" }} transition={{ duration: 0.6 }}>
        <div className="panel">
          <div className="panel-title">Candlestick range tape</div>
          <CandlestickChart data={chartData} aspectRatio="2.4 / 1" margin={{ top: 18, right: 18, bottom: 18, left: 18 }}>
            <Grid horizontal vertical stroke="rgba(255,255,255,0.12)" strokeDasharray="4,6" />
            <Candlestick positiveFill="#14b8a6" negativeFill="#f43f46" />
          </CandlestickChart>
        </div>
        <div className="panel">
          <div className="panel-title">Liquidity and fee composition</div>
          <ComposedChart data={chartData} aspectRatio="2.4 / 1" margin={{ top: 18, right: 18, bottom: 18, left: 18 }} barSize={9}>
            <Grid horizontal stroke="rgba(255,255,255,0.12)" strokeDasharray="4,6" />
            <SeriesBar dataKey="liquidity" fill="rgba(20,184,166,0.42)" radius={4} />
            <Line dataKey="price" stroke="#14b8a6" strokeWidth={2.4} showMarkers />
            <Line dataKey="fees" stroke="#5eead4" strokeWidth={1.8} />
          </ComposedChart>
        </div>
        <div className="panel">
          <div className="panel-title">Transaction funnel</div>
          <FunnelChart
            data={funnelData}
            color="#14b8a6"
            edges="straight"
            gap={8}
            grid={{ bands: true, bandColor: "rgba(255,255,255,0.035)", lines: true, lineColor: "rgba(255,255,255,0.1)" }}
            layers={2}
            showPercentage={false}
          />
        </div>
      </motion.section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span className="eyebrow">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
