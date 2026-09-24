"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowsClockwise, Pulse, Sliders, Sparkle, Warning } from "@phosphor-icons/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { AppNav } from "@/components/app/app-nav";
import { ClmmCloseControls, type WalletClmmPosition } from "@/components/app/clmm-close-controls";
import { Footer } from "@/components/footer";

export default function PositionsPage() {
  const { publicKey } = useWallet();
  const [filterState, setFilterState] = useState<"ALL" | "IN_RANGE" | "OUT_OF_RANGE">("ALL");
  const [positions, setPositions] = useState<WalletClmmPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Connect a wallet and refresh to load on-chain CLMM positions.");

  const loadPositions = useCallback(async () => {
    if (!publicKey) {
      setPositions([]);
      setStatus("Connect a wallet to inspect Raydium CLMM positions.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/raydium/clmm-close-position?wallet=${encodeURIComponent(publicKey.toBase58())}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Lookup failed.");
      setPositions(data.positions ?? []);
      setStatus(`Loaded ${(data.positions ?? []).length} on-chain position(s).`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Lookup failed.");
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    void loadPositions();
  }, [loadPositions]);

  const filteredPositions = positions;

  return (
    <main className="app-shell">
      <AppNav />

      <section className="app-main">
        <div className="section-heading">
          <div className="flex items-center gap-2 mb-2">
            <span className="cta-eyebrow-pill">
              <Sliders size={14} /> CLMM Position Manager
            </span>
          </div>
          <h1>Active Position Frames</h1>
          <p>
            Inspect on-chain Raydium CLMM positions owned by your connected wallet. Prepare and approve close transactions in your wallet without giving up custody.
          </p>
        </div>

        <div className="page-stats-summary">
          <div className="stat-metric-card">
            <small>On-Chain Positions</small>
            <strong>{positions.length} Loaded</strong>
          </div>
          <div className="stat-metric-card">
            <small>Wallet</small>
            <strong>{publicKey ? `${publicKey.toBase58().slice(0, 4)}…${publicKey.toBase58().slice(-4)}` : "Not connected"}</strong>
          </div>
          <div className="stat-metric-card">
            <small>Status</small>
            <strong>{loading ? "Refreshing…" : "Ready"}</strong>
          </div>
          <div className="stat-metric-card">
            <small>Protocol</small>
            <strong className="text-blue-400">Raydium CLMM</strong>
          </div>
        </div>

        <div className="filter-toolbar">
          <div className="filter-pills-group">
            <button type="button" onClick={() => setFilterState("ALL")} className={filterState === "ALL" ? "filter-btn active" : "filter-btn"}>
              All Frames ({filteredPositions.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className="btn secondary text-xs" disabled={loading} onClick={() => void loadPositions()}>
              <ArrowsClockwise size={14} /> Refresh positions
            </button>
            <Link href="/app" className="btn secondary text-xs">
              <Sparkle size={14} /> Frame New Position
            </Link>
          </div>
        </div>

        {status ? <p className="clmm-status-line" role="status">{status}</p> : null}

        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Position NFT</th>
                <th>Pool</th>
                <th>Ticks</th>
                <th>Liquidity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPositions.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-positions-state">
                      <Warning size={18} />
                      <p>No allowlisted-pool positions found for this wallet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPositions.map((pos) => (
                  <tr key={pos.nftMint} className="pool-row-card">
                    <td>
                      <div className="flex flex-col">
                        <strong className="text-white mono">{pos.nftMint.slice(0, 8)}…{pos.nftMint.slice(-6)}</strong>
                        <span className="mono text-xs text-slate-400">{pos.nftMint}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{pos.pair}</span>
                        <span className="text-xs text-slate-400 mono">{pos.poolId.slice(0, 8)}…</span>
                      </div>
                    </td>
                    <td>
                      <span className="range-status-badge in-range">
                        <Pulse size={12} weight="bold" />
                        {pos.tickLower} / {pos.tickUpper}
                      </span>
                    </td>
                    <td className="mono font-bold text-white">{pos.liquidity}</td>
                    <td>
                      <ClmmCloseControls position={pos} onClosed={() => void loadPositions()} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Footer />
    </main>
  );
}
