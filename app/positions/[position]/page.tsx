import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { AppNav } from "@/components/app/app-nav";
import { demoPositions } from "@/lib/positions";

type PositionDetailPageProps = {
  params: Promise<{ position: string }>;
};

export default async function PositionDetailPage({ params }: PositionDetailPageProps) {
  const { position: positionId } = await params;
  const position = demoPositions.find((item) => item.id === positionId);
  if (!position) notFound();

  return (
    <main className="app-shell">
      <AppNav />
      <section className="app-main">
        <Link className="btn ghost" href="/positions"><ArrowLeft size={15} /> Back to positions</Link>
        <div className="app-grid" style={{ marginTop: 20 }}>
          <section className="panel range-builder">
            <span className="eyebrow">Demo position detail</span>
            <h1>{position.id}</h1>
            <p>This page shows a static design example. It is not an on-chain position owned by your wallet.</p>
            <div className="range-rail">
              <div className="range-fill">
                <span className="range-handle lower">{position.lowerPrice.toFixed(2)}</span>
                <span className="range-handle upper">{position.upperPrice.toFixed(2)}</span>
              </div>
              <i className="range-current" />
            </div>
            <div className="metric-grid">
              <div className="metric"><span className="eyebrow">State</span><strong>{position.state.replace("_", " ")}</strong></div>
              <div className="metric"><span className="eyebrow">Composition</span><strong>{position.tokenA}% / {position.tokenB}%</strong></div>
              <div className="metric"><span className="eyebrow">Fees</span><strong>{position.unclaimedFees}</strong></div>
            </div>
          </section>
          <aside className="panel">
            <span className="eyebrow">Exit flow</span>
            <p>Demo exit controls are unwired previews. Close real positions from /positions after wallet discovery succeeds.</p>
            <button className="btn secondary" style={{ width: "100%", marginTop: 12 }} disabled>Remove liquidity preview</button>
            <button className="btn danger" style={{ width: "100%", marginTop: 12 }} disabled>Close position preview</button>
            <p><WarningCircle size={15} /> Production close requests wallet approval only after a successful prepare and simulation.</p>
          </aside>
        </div>
      </section>
    </main>
  );
}
