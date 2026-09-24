"use client";

import { Transaction, VersionedTransaction } from "@solana/web3.js";
import type { Connection } from "@solana/web3.js";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import { decodeTransactionBase64 } from "@/lib/solana/tx-helpers";

export type DecodedTransaction = Transaction | VersionedTransaction;

export function decodePreparedTransaction(encoded: string) {
  return decodeTransactionBase64(encoded);
}

/**
 * Send a server-prepared transaction through the wallet adapter.
 * Delegates to Phantom's native signAndSendTransaction when available,
 * which reduces Blowfish "malicious dApp" false positives vs raw
 * signTransaction + sendRawTransaction.
 */
export async function sendPreparedTransaction(
  tx: DecodedTransaction,
  connection: Connection,
  sendTransaction: NonNullable<WalletContextState["sendTransaction"]>
) {
  const signature = await sendTransaction(tx, connection, { skipPreflight: false });
  await connection.confirmTransaction(signature, "confirmed");
  return signature;
}

export function solscanTxUrl(signature: string) {
  return `https://solscan.io/tx/${signature}`;
}
