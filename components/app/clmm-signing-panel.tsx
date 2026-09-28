"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CheckCircle, FrameCorners, LockKey, WarningCircle } from "@phosphor-icons/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import type { PoolSummary } from "@/lib/pools";
import { decodePreparedTransaction, sendPreparedTransaction, solscanTxUrl } from "@/lib/raydium/clmm-wallet";
import { transactionLabels, transactionReducer, type TransactionStage } from "@/lib/transactions";
import type { DecodedTransaction } from "@/lib/raydium/clmm-wallet";

const stages = ["building", "simulating", "ready", "awaiting_wallet", "submitted", "confirming", "confirmed"] as const;

type PrepareMeta = {
  nftMint?: string;
  explorerUrl?: string;
  otherAmountMax?: string;
  otherSymbol?: string;
  otherDecimals?: number;
  preparedLower?: string;
  preparedUpper?: string;
  slippageBps?: number;
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

function formatRawAmount(raw: string | undefined, decimals: number | undefined, symbol: string | undefined) {
  if (!raw || decimals === undefined || !symbol) return "—";
  const value = Number(raw) / 10 ** decimals;
  if (!Number.isFinite(value)) return `${raw} ${symbol}`;
  return `${value.toLocaleString("en-US", { maximumFractionDigits: Math.min(decimals, 6) })} ${symbol}`;
}

export function ClmmSigningPanel({ pool, lower, upper, deposit, slippage, onSlippageChange, stage, dispatch }: ClmmSigningPanelProps) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [busy, setBusy] = useState(false);
  const [preparedTx, setPreparedTx] = useState<DecodedTransaction | null>(null);
  const [meta, setMeta] = useState<PrepareMeta | null>(null);
  const [status, setStatus] = useState("");
  const prepareGeneration = useRef(0);

  const slippageBps = useMemo(() => Math.max(1, Math.round(slippage * 100)), [slippage]);
  const walletKey = publicKey?.toBase58() ?? "";
  const rpcEndpoint = connection.rpcEndpoint;

  useEffect(() => {
    prepareGeneration.current += 1;
    setPreparedTx(null);
    setMeta(null);
    setStatus("");
  }, [pool.id, lower, upper, deposit, slippage, walletKey, rpcEndpoint]);

  async function prepare(): Promise<DecodedTransaction | null> {
    if (!publicKey) {
      setStatus("Connect your wallet to prepare a CLMM position.");
      dispatch({ type: "FAIL" });
      return null;
    }

    const generation = ++prepareGeneration.current;
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
      if (generation !== prepareGeneration.current) return null;
      dispatch({ type: "SIMULATE" });

      if (!response.ok || !data.transactionBase64) {
        throw new Error(data.error ?? "Prepare failed.");
      }
      if (data.simulation?.err) {
        throw new Error(`Simulation failed: ${JSON.stringify(data.simulation.err)}`);
      }

      const tx = decodePreparedTransaction(data.transactionBase64);
      setPreparedTx(tx);
      setMeta({
        nftMint: data.position?.nftMint,
        otherAmountMax: data.otherAmountMax,
        otherSymbol: data.otherSymbol,
        otherDecimals: data.otherDecimals,
        preparedLower: data.lowerPrice,
        preparedUpper: data.upperPrice,
        slippageBps: data.slippageBps
      });
      dispatch({ type: "READY" });
      setStatus("Transaction prepared and simulated. Review both token maxima below, then approve in your wallet.");
      return tx;
    } catch (error) {
      if (generation === prepareGeneration.current) {
        dispatch({ type: "FAIL" });
        setPreparedTx(null);
        setMeta(null);
        setStatus(error instanceof Error ? error.message : "Prepare failed.");
      }
      return null;
    } finally {
      if (generation === prepareGeneration.current) setBusy(false);
    }
  }

  async function broadcast() {
    if (!sendTransaction) {
      setStatus("Wallet does not support sending transactions.");
      return;
    }
    if (!preparedTx) {
      setStatus("Prepare a fresh transaction before approving.");
      return;
    }

    setBusy(true);
    dispatch({ type: "REQUEST_SIGNATURE" });
    dispatch({ type: "SUBMIT" });
    try {
      const signature = await sendPreparedTransaction(preparedTx, connection, sendTransaction);
      dispatch({ type: "CONFIRM" });
      dispatch({ type: "RESOLVE" });
      const explorerUrl = solscanTxUrl(signature);
      setMeta((current) => ({ ...current, explorerUrl }));
      setStatus(`Position opened. Confirmed: ${signature.slice(0, 8)}…`);
      setPreparedTx(null);
    } catch (error) {
      dispatch({ type: "FAIL" });
      setStatus(error instanceof Error ? error.message : "Broadcast failed.");
    } finally {
      setBusy(false);
    }
  }

  const otherMaxLabel = formatRawAmount(meta?.otherAmountMax, meta?.otherDecimals, meta?.otherSymbol);

  return (
    <>
      <div className="panel-title"><LockKey size={17} /> Signing snapshot</div>
      <div className="snapshot-grid">
        <Metric label="Base deposit" value={`${deposit} ${pool.baseSymbol}`} />
        <Metric label="Other token max" value={meta ? otherMaxLabel : "Prepare to reveal"} />
        <Metric label="Prepared lower" value={meta?.preparedLower ?? lower.toFixed(2)} />
        <Metric label="Prepared upper" value={meta?.preparedUpper ?? upper.toFixed(2)} />
        <Metric label="Slippage" value={`${(meta?.slippageBps ?? slippageBps) / 100}%`} />
      </div>
      <label className="field">
        <span>Slippage %</span>
        <input value={slippage} onChange={(e) => onSlippageChange(Number(e.target.value))} type="number" step="0.1" min="0.01" max="50" />
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
        <button className="btn" disabled={busy || !preparedTx} onClick={() => void broadcast()} style={{ width: "100%" }}>
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
      <p>
        <WarningCircle size={15} /> A CLMM open may debit both tokens up to the prepared maxima, plus account rent and network fees.
        Re-prepare after changing wallet, deposit, range, or slippage. Your wallet shows the full instruction preview before anything is sent.
      </p>
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
