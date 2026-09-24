"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle, FrameCorners, LockKey, WarningCircle } from "@phosphor-icons/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import type { PoolSummary } from "@/lib/pools";
import { decodePreparedTransaction, sendPreparedTransaction, solscanTxUrl } from "@/lib/raydium/clmm-wallet";
import { transactionLabels, transactionReducer, type TransactionStage } from "@/lib/transactions";
import type { DecodedTransaction } from "@/lib/raydium/clmm-wallet";

const stages = ["building", "simulating", "ready", "awaiting_wallet", "submitted", "confirming", "confirmed"] as const;

type PrepareMeta = {
  nftMint?: string;
  simulationErr?: unknown;
  explorerUrl?: string;
};

type ClmmSigningPanelProps = {
  pool: PoolSummary;
  lower: number;
  upper: number;
  deposit: number;
  slippage: number;
  onSlippageChange: (value: number) => void;
  stage: TransactionStage;
  dispatch: React.Dispatch<{ type: Parameters<typeof transactionReducer>[1]["type"] }>;
};

export function ClmmSigningPanel({ pool, lower, upper, deposit, slippage, onSlippageChange, stage, dispatch }: ClmmSigningPanelProps) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [busy, setBusy] = useState(false);
  const [preparedTx, setPreparedTx] = useState<DecodedTransaction | null>(null);
  const [meta, setMeta] = useState<PrepareMeta | null>(null);
  const [status, setStatus] = useState("");

  const slippageBps = useMemo(() => Math.max(1, Math.round(slippage * 100)), [slippage]);

  useEffect(() => {
    setPreparedTx(null);
    setMeta(null);
    setStatus("");
  }, [pool.id, lower, upper, deposit, slippage]);

  async function prepare(): Promise<DecodedTransaction | null> {
    if (!publicKey) {
      setStatus("Connect your wallet to prepare a CLMM position.");
      dispatch({ type: "FAIL" });
      return null;
    }

    setBusy(true);
    setStatus("");
    dispatch({ type: "BUILD" });

    try {
      const response = await fetch("/api/raydium/clmm-open-position", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          wallet: publicKey.toBase58(),
          poolId: pool.id,
          lowerPrice: String(lower),
          upperPrice: String(upper),
          baseAmount: String(deposit),
          slippageBps
        })
      });

      const data = await response.json();
      dispatch({ type: "SIMULATE" });

      if (!response.ok || !data.transactionBase64) {
        throw new Error(data.error ?? "Prepare failed.");
      }

      const tx = decodePreparedTransaction(data.transactionBase64);
      setPreparedTx(tx);
      setMeta({ nftMint: data.position?.nftMint, simulationErr: data.simulation?.err });
      dispatch({ type: "READY" });
      setStatus(
        data.simulation?.err
          ? "Prepared with simulation warnings. Review carefully in your wallet before approving."
          : "Transaction prepared. Phantom will show a full preview when you approve."
      );
      return tx;
    } catch (error) {
      dispatch({ type: "FAIL" });
      setStatus(error instanceof Error ? error.message : "Prepare failed.");
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function broadcast() {
    if (!sendTransaction) {
      setStatus("Wallet does not support sending transactions.");
      return;
    }

    const tx = preparedTx ?? (await prepare());
    if (!tx) return;

    setBusy(true);
    dispatch({ type: "REQUEST_SIGNATURE" });
    dispatch({ type: "SUBMIT" });
    try {
      const signature = await sendPreparedTransaction(tx, connection, sendTransaction);
      dispatch({ type: "CONFIRM" });
      dispatch({ type: "RESOLVE" });
      const explorerUrl = solscanTxUrl(signature);
      setMeta((current) => ({ ...current, explorerUrl }));
      setStatus(`Position opened. Confirmed: ${signature.slice(0, 8)}…`);
    } catch (error) {
      dispatch({ type: "FAIL" });
      setStatus(error instanceof Error ? error.message : "Broadcast failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="panel-title"><LockKey size={17} /> Signing snapshot</div>
      <div className="snapshot-grid">
        <Metric label="Deposit" value={`${deposit} ${pool.baseSymbol}`} />
        <Metric label="Lower" value={lower.toFixed(2)} />
        <Metric label="Upper" value={upper.toFixed(2)} />
        <Metric label="Slippage" value={`${slippage.toFixed(1)}%`} />
      </div>
      <label className="field">
        <span>Slippage</span>
        <input value={slippage} onChange={(e) => onSlippageChange(Number(e.target.value))} type="number" step="0.1" />
      </label>
      <div className="stage-list">
        {stages.map((item) => (
          <div className={stage === item ? "stage active" : "stage"} key={item}>
            <span>{transactionLabels[item]}</span>
            {stage === item ? <CheckCircle size={16} /> : <FrameCorners size={16} />}
          </div>
        ))}
      </div>

      <div className="clmm-action-stack">
        <button className="btn secondary" disabled={busy} onClick={() => void prepare()} style={{ width: "100%" }}>
          Prepare transaction <ArrowRight size={16} />
        </button>
        <button className="btn" disabled={busy} onClick={() => void broadcast()} style={{ width: "100%" }}>
          Approve &amp; send in wallet <ArrowRight size={16} />
        </button>
      </div>

      {meta?.nftMint ? <p className="clmm-meta-line">Position NFT: {meta.nftMint.slice(0, 8)}…{meta.nftMint.slice(-6)}</p> : null}
      {meta?.explorerUrl ? (
        <p className="clmm-meta-line">
          <a href={meta.explorerUrl} target="_blank" rel="noreferrer">View on Solscan</a>
        </p>
      ) : null}
      {status ? <p className="clmm-status-line" role="status">{status}</p> : null}
      <p><WarningCircle size={15} /> Prepare uses your deposit amount ({deposit} {pool.baseSymbol}) plus small rent for the position NFT. Re-prepare after changing deposit or range. Your wallet shows the full preview before anything is sent.</p>
    </>
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
