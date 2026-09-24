"use client";

import { useCallback, useEffect, useState } from "react";
import { WarningCircle } from "@phosphor-icons/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { decodePreparedTransaction, sendPreparedTransaction, solscanTxUrl } from "@/lib/raydium/clmm-wallet";
import type { DecodedTransaction } from "@/lib/raydium/clmm-wallet";

export type WalletClmmPosition = {
  nftMint: string;
  poolId: string;
  pair: string;
  tickLower: number;
  tickUpper: number;
  liquidity: string;
};

type ClmmCloseControlsProps = {
  position: WalletClmmPosition;
  onClosed?: () => void;
};

export function ClmmCloseControls({ position, onClosed }: ClmmCloseControlsProps) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [minOut, setMinOut] = useState<{ amountA: string; amountB: string; slippageBps: number } | null>(null);
  const [preparedTx, setPreparedTx] = useState<DecodedTransaction | null>(null);

  useEffect(() => {
    setPreparedTx(null);
    setMinOut(null);
    setStatus("");
  }, [position.nftMint]);

  const prepare = useCallback(async () => {
    if (!publicKey) {
      setStatus("Connect your wallet first.");
      return null;
    }

    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/raydium/clmm-close-position", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          wallet: publicKey.toBase58(),
          poolId: position.poolId,
          positionNftMint: position.nftMint
        })
      });
      const data = await response.json();
      if (!response.ok || !data.transactionBase64) {
        throw new Error(data.error ?? "Prepare failed.");
      }

      const tx = decodePreparedTransaction(data.transactionBase64);
      setPreparedTx(tx);
      setMinOut(data.minimumWithdrawal ?? null);
      setStatus("Close prepared. Approve in your wallet when ready — Phantom shows the preview.");
      return tx;
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Prepare failed.");
      return null;
    } finally {
      setBusy(false);
    }
  }, [position.nftMint, position.poolId, publicKey]);

  async function broadcast() {
    if (!sendTransaction) {
      setStatus("Wallet does not support sending transactions.");
      return;
    }
    if (!window.confirm("Close this position? Liquidity will be withdrawn and the position account closed.")) return;

    const tx = preparedTx ?? (await prepare());
    if (!tx) return;

    setBusy(true);
    try {
      const signature = await sendPreparedTransaction(tx, connection, sendTransaction);
      setStatus(`Closed: ${signature.slice(0, 8)}…`);
      onClosed?.();
      window.open(solscanTxUrl(signature), "_blank", "noopener,noreferrer");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Broadcast failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="clmm-close-controls">
      {minOut ? (
        <p className="clmm-meta-line">
          Min out A: {minOut.amountA} · B: {minOut.amountB} · slippage {minOut.slippageBps} bps
        </p>
      ) : null}
      <div className="clmm-action-stack horizontal">
        <button type="button" className="btn secondary text-xs py-1.5 px-3" disabled={busy} onClick={() => void prepare()}>
          Prepare close
        </button>
        <button type="button" className="btn text-xs py-1.5 px-3" disabled={busy} onClick={() => void broadcast()}>
          Approve &amp; close
        </button>
      </div>
      {status ? <p className="clmm-status-line" role="status">{status}</p> : null}
      <p className="clmm-warning-line"><WarningCircle size={13} /> Closing is irreversible. Returned amounts can differ from deposit due to IL, fees, and price movement.</p>
    </div>
  );
}
