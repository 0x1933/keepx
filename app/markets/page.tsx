"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  ChartLineUp, 
  MagnifyingGlass, 
  Pulse, 
  ShieldCheck
} from "@phosphor-icons/react";
import { AppNav } from "@/components/app/app-nav";
import { Footer } from "@/components/footer";
import { allowlistedPools } from "@/lib/pools";

export default function MarketsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredPools = useMemo(() => {
    return allowlistedPools.filter((pool) => {
      const matchesSearch = 
        pool.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pool.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pool.baseSymbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pool.quoteSymbol.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedFilter === "sol") {
        return pool.pair.includes("SOL");
      }
      if (selectedFilter === "high-yield") {
        return pool.apr && parseFloat(pool.apr) >= 24;
      }
      if (selectedFilter === "stables") {
        return pool.quoteSymbol === "USDC" || pool.quoteSymbol === "USDT";
      }

      return true;
    });
  }, [searchQuery, selectedFilter]);

  const totalTvl = allowlistedPools.reduce((acc, p) => acc + (p.tvlUsd || 0), 0);
  const totalVol = allowlistedPools.reduce((acc, p) => acc + (p.volume24hUsd || 0), 0);

  return (
    <main className="app-shell">
      <AppNav />

      <section className="app-main">
        {/* Header */}
        <div className="section-heading">
          <div className="flex items-center gap-2 mb-2">
            <span className="cta-eyebrow-pill">
              <ShieldCheck size={14} /> Raydium CLMM Allowlist
            </span>
          </div>
          <h1>Concentrated Liquidity Markets</h1>
          <p>
            Keepx starts narrow on purpose. Every pool is explicit, verified, and linked directly to an isolated range and simulation pipeline.
          </p>
        </div>

        {/* Stats Summary Strip */}
        <div className="page-stats-summary">
          <div className="stat-metric-card">
            <small>Total Verified Pools</small>
            <strong>{allowlistedPools.length} Active</strong>
          </div>
          <div className="stat-metric-card">
            <small>Allowlist Combined TVL</small>
            <strong>${(totalTvl / 1_000_000).toFixed(1)}M</strong>
          </div>
          <div className="stat-metric-card">
            <small>24H Aggregate Volume</small>
            <strong>${(totalVol / 1_000_000).toFixed(1)}M</strong>
          </div>
          <div className="stat-metric-card">
            <small>Top APR Opportunity</small>
            <strong className="text-emerald-400">41.2% (BTC/SOL)</strong>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filter-toolbar">
          <div className="filter-search-box">
            <MagnifyingGlass size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search pair or pool ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search markets"
            />
          </div>

          <div className="filter-pills-group">
            <button
              type="button"
              onClick={() => setSelectedFilter("all")}
              className={selectedFilter === "all" ? "filter-btn active" : "filter-btn"}
            >
              All Pools
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter("sol")}
              className={selectedFilter === "sol" ? "filter-btn active" : "filter-btn"}
            >
              SOL Pairs
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter("high-yield")}
              className={selectedFilter === "high-yield" ? "filter-btn active" : "filter-btn"}
            >
              High APR (&gt;24%)
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter("stables")}
              className={selectedFilter === "stables" ? "filter-btn active" : "filter-btn"}
            >
              Stablecoin Pairs
            </button>
          </div>
        </div>

        {/* Markets Table */}
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Market Pair</th>
                <th>Current Price</th>
                <th>Fee Tier</th>
                <th>Tick Spacing</th>
                <th>24H Volume</th>
                <th>Est. Fee APR</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredPools.map((pool) => (
                <tr key={pool.id} className="pool-row-card">
                  <td>
                    <div className="flex flex-col">
                      <strong className="text-base text-white">{pool.pair}</strong>
                      <span className="mono text-xs text-slate-400">
                        {pool.id.slice(0, 6)}...{pool.id.slice(-4)}
                      </span>
                    </div>
                  </td>
                  <td className="mono font-semibold text-blue-400">
                    {pool.currentPrice < 1 ? pool.currentPrice.toFixed(5) : `$${pool.currentPrice.toFixed(2)}`}
                  </td>
                  <td>
                    <span className="mono text-xs px-2 py-1 bg-white/5 border border-white/10 rounded">
                      {pool.feeTier}
                    </span>
                  </td>
                  <td>
                    <span className="mono text-xs text-slate-300">
                      {pool.tickSpacing} ticks
                    </span>
                  </td>
                  <td className="mono text-slate-300">
                    {pool.volume24hUsd ? `$${(pool.volume24hUsd / 1_000_000).toFixed(2)}M` : "-"}
                  </td>
                  <td>
                    {pool.apr ? (
                      <span className="apr-pill-high">
                        <ChartLineUp size={13} /> {pool.apr}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <span className="range-status-badge in-range">
                      <Pulse size={10} weight="bold" /> {pool.status}
                    </span>
                  </td>
                  <td>
                    <Link className="btn secondary" href={`/app?pool=${pool.id}`}>
                      Frame <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredPools.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    No matching pools found for &quot;{searchQuery}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Footer />
    </main>
  );
}
