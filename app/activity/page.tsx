"use client";

import { useState } from "react";
import { 
  ArrowUpRight, 
  Broadcast, 
  CheckCircle, 
  Clock
} from "@phosphor-icons/react";
import { AppNav } from "@/components/app/app-nav";
import { Footer } from "@/components/footer";

const activityEvents = [
  {
    id: "tx-1",
    action: "OPEN POSITION",
    type: "TRANSACTION",
    pool: "SOL / USDC",
    signature: "5KqZ...9uL2",
    fullSig: "5KqZ8mNxL92vQaP3rK1mZsTtW84bYyX29uL2",
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
    signature: "Simulated Slot #284,910,214",
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
    signature: "Hash: 87b4...d10e",
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
    pool: "SOL / USDT",
    signature: "3Nrt...8vQ1",
    fullSig: "3Nrt4vLxP89aZsQwY12kLmTtP98bVvX38vQ1",
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
    pool: "JUP / SOL",
    signature: "9mPq...4kL9",
    fullSig: "9mPq7vNxL88vQaP2rK1mZsTtW99bYyX44kL9",
    status: "CONFIRMED",
    computeUnits: "148,900 CUs",
    gasFee: "0.00008 SOL",
    time: "2h ago",
    details: "Withdrew out-of-range liquidity and created fresh position at 0.00842"
  }
];

export default function ActivityPage() {
  const [filter, setFilter] = useState<"ALL" | "TRANSACTION" | "SIMULATION">("ALL");

  const filteredEvents = activityEvents.filter((item) => {
    if (filter === "TRANSACTION") return item.type === "TRANSACTION";
    if (filter === "SIMULATION") return item.type === "SIMULATION" || item.type === "SNAPSHOT";
    return true;
  });

  return (
    <main className="app-shell">
      <AppNav />

      <section className="app-main">
        {/* Header */}
        <div className="section-heading">
          <div className="flex items-center gap-2 mb-2">
            <span className="cta-eyebrow-pill">
              <Broadcast size={14} /> On-Chain Telemetry
            </span>
          </div>
          <h1>Session & On-Chain Activity</h1>
          <p>
            Keepx records client-originating confirmations and pre-flight simulations. Every action is verified against Solana RPC nodes in real-time.
          </p>
        </div>

        {/* Stats Summary */}
        <div className="page-stats-summary">
          <div className="stat-metric-card">
            <small>Session Transactions</small>
            <strong>{activityEvents.length} Total Logs</strong>
          </div>
          <div className="stat-metric-card">
            <small>RPC Confirmation Rate</small>
            <strong className="text-emerald-400">100.0% Verified</strong>
          </div>
          <div className="stat-metric-card">
            <small>Avg Execution Speed</small>
            <strong className="text-blue-400">410ms Finality</strong>
          </div>
          <div className="stat-metric-card">
            <small>Current Solana Slot</small>
            <strong className="mono">#284,910,248</strong>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-toolbar">
          <div className="filter-pills-group">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={filter === "ALL" ? "filter-btn active" : "filter-btn"}
            >
              All Activity Logs
            </button>
            <button
              type="button"
              onClick={() => setFilter("TRANSACTION")}
              className={filter === "TRANSACTION" ? "filter-btn active" : "filter-btn"}
            >
              On-Chain Transactions
            </button>
            <button
              type="button"
              onClick={() => setFilter("SIMULATION")}
              className={filter === "SIMULATION" ? "filter-btn active" : "filter-btn"}
            >
              Pre-Flight Simulations
            </button>
          </div>
        </div>

        {/* Activity Table */}
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Action & Pool</th>
                <th>Details & Execution</th>
                <th>Signature / Proof</th>
                <th>Compute & Gas</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((evt) => (
                <tr key={evt.id} className="pool-row-card">
                  <td>
                    <div className="flex flex-col">
                      <strong className="text-white flex items-center gap-1.5">
                        {evt.action}
                      </strong>
                      <span className="text-xs text-blue-400 font-medium">{evt.pool}</span>
                    </div>
                  </td>
                  <td>
                    <p className="text-xs text-slate-300 max-w-md m-0">{evt.details}</p>
                  </td>
                  <td>
                    {evt.fullSig ? (
                      <a
                        href={`https://solscan.io/tx/${evt.fullSig}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mono text-xs text-blue-400 hover:underline inline-flex items-center gap-1"
                      >
                        {evt.signature} <ArrowUpRight size={12} />
                      </a>
                    ) : (
                      <span className="mono text-xs text-slate-400">{evt.signature}</span>
                    )}
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
