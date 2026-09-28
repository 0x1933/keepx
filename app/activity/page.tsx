"use client";

import { useState } from "react";
import { Broadcast, CheckCircle, Clock } from "@phosphor-icons/react";
import { AppNav } from "@/components/app/app-nav";
import { Footer } from "@/components/footer";

/** Illustrative demo events only — not live wallet activity or verifiable signatures. */
const demoActivityEvents = [
  {
    id: "tx-1",
    action: "OPEN POSITION",
    type: "TRANSACTION",
    pool: "SOL / USDC",
    signature: "Demo example (not a real signature)",
    status: "CONFIRMED",
    computeUnits: "92,410 CUs",
    gasFee: "0.00005 SOL",
    time: "3m ago",
    details: "Framed ±6.0% interval ($175.06 - $197.41) with 5.4 SOL + 1,005 USDC"
  },
  {
    id: "tx-2",
    action: "PRE-SIGN SIMULATION",
    type: "SIMULATION",
    pool: "SOL / USDC",
    signature: "Demo simulation log",
    status: "PASSED",
    computeUnits: "78,120 CUs",
    gasFee: "0.00000 SOL (Sim)",
    time: "4m ago",
    details: "Verified balance constraints, tick spacing parity, and zero slippage variance"
  },
  {
    id: "tx-3",
    action: "SIGNING SNAPSHOT",
    type: "SNAPSHOT",
    pool: "SOL / USDC",
    signature: "Demo snapshot hash",
    status: "CAPTURED",
    computeUnits: "-",
    gasFee: "-",
    time: "5m ago",
    details: "Generated deterministic instruction packet for Phantom Wallet signing"
  },
  {
    id: "tx-4",
    action: "HARVEST REWARDS",
    type: "TRANSACTION",
    pool: "SOL / USDC",
    signature: "Demo example (not a real signature)",
    status: "CONFIRMED",
    computeUnits: "64,300 CUs",
    gasFee: "0.00005 SOL",
    time: "42m ago",
    details: "Collected $18.42 in accumulated swap trading fees directly to wallet"
  },
  {
    id: "tx-5",
    action: "FRAME REBALANCE",
    type: "TRANSACTION",
    pool: "SOL / USDC",
    signature: "Demo example (not a real signature)",
    status: "CONFIRMED",
    computeUnits: "148,900 CUs",
    gasFee: "0.00008 SOL",
    time: "2h ago",
    details: "Withdrew out-of-range liquidity and created a fresh position"
  }
];

export default function ActivityPage() {
  const [filter, setFilter] = useState<"ALL" | "TRANSACTION" | "SIMULATION">("ALL");

  const filteredEvents = demoActivityEvents.filter((item) => {
    if (filter === "TRANSACTION") return item.type === "TRANSACTION";
    if (filter === "SIMULATION") return item.type === "SIMULATION" || item.type === "SNAPSHOT";
    return true;
  });

  return (
    <main className="app-shell">
      <AppNav />

      <section className="app-main">
        <div className="section-heading">
          <div className="flex items-center gap-2 mb-2">
            <span className="cta-eyebrow-pill">
              <Broadcast size={14} /> Demo preview
            </span>
          </div>
          <h1>Session &amp; On-Chain Activity</h1>
          <p>
            These rows are static design examples. They are not your wallet history, RPC confirmations, or live Solana activity.
            Real open/close results appear in your wallet and on explorers after you approve a transaction.
          </p>
        </div>

        <div className="page-stats-summary">
          <div className="stat-metric-card">
            <small>Demo Log Count</small>
            <strong>{demoActivityEvents.length} Example Rows</strong>
          </div>
          <div className="stat-metric-card">
            <small>Data source</small>
            <strong>Static demo</strong>
          </div>
          <div className="stat-metric-card">
            <small>Live feed</small>
            <strong>Not connected</strong>
          </div>
          <div className="stat-metric-card">
            <small>Wallet activity</small>
            <strong>See /positions</strong>
          </div>
        </div>

        <div className="filter-toolbar">
          <div className="filter-pills-group">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={filter === "ALL" ? "filter-btn active" : "filter-btn"}
            >
              All Demo Logs
            </button>
            <button
              type="button"
              onClick={() => setFilter("TRANSACTION")}
              className={filter === "TRANSACTION" ? "filter-btn active" : "filter-btn"}
            >
              Demo Transactions
            </button>
            <button
              type="button"
              onClick={() => setFilter("SIMULATION")}
              className={filter === "SIMULATION" ? "filter-btn active" : "filter-btn"}
            >
              Demo Simulations
            </button>
          </div>
        </div>

        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Action &amp; Pool</th>
                <th>Details &amp; Execution</th>
                <th>Demo Reference</th>
                <th>Compute &amp; Gas</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((evt) => (
                <tr key={evt.id} className="pool-row-card">
                  <td>
                    <div className="flex flex-col">
                      <strong className="text-white flex items-center gap-1.5">{evt.action}</strong>
                      <span className="text-xs text-blue-400 font-medium">{evt.pool}</span>
                    </div>
                  </td>
                  <td>
                    <p className="text-xs text-slate-300 max-w-md m-0">{evt.details}</p>
                  </td>
                  <td>
                    <span className="mono text-xs text-slate-400">{evt.signature}</span>
                  </td>
                  <td>
                    <div className="flex flex-col text-xs mono text-slate-400">
                      <span>{evt.computeUnits}</span>
                      <span>{evt.gasFee}</span>
                    </div>
                  </td>
                  <td>
                    <span className="range-status-badge in-range">
                      <CheckCircle size={12} weight="bold" /> {evt.status}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> {evt.time}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Footer />
    </main>
  );
}
