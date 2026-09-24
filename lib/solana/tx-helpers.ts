import {
  Connection,
  PublicKey,
  Transaction,
  VersionedTransaction,
  type Transaction as LegacyTx
} from "@solana/web3.js";

export type TransactionLike = LegacyTx | VersionedTransaction;

export type TransactionDiagnostics = {
  version: "legacy" | 0;
  serializedBytes: number;
  requiredSigners: number;
  feePayer: string | null;
  signerKeys: string[];
  populatedSignatures: boolean[];
  programIds: string[];
  lookupTableAccountCount: number;
};

export type SimulationDiagnostics = {
  err: unknown | null;
  logs: string[];
  unitsConsumed: number | null;
};

function isZeroSig(sig: Uint8Array) {
  return sig.every((byte) => byte === 0);
}

export function inspectTransaction(tx: TransactionLike, serializedBytes: number): TransactionDiagnostics {
  if (tx instanceof VersionedTransaction) {
    const keys = tx.message.staticAccountKeys.map((key) => key.toBase58());
    const requiredSigners = tx.message.header.numRequiredSignatures;
    const signerKeys = keys.slice(0, requiredSigners);
    const populatedSignatures = tx.signatures.slice(0, requiredSigners).map((sig) => !isZeroSig(sig));

    return {
      version: 0,
      serializedBytes,
      requiredSigners,
      feePayer: signerKeys[0] ?? null,
      signerKeys,
      populatedSignatures,
      programIds: [...new Set(tx.message.compiledInstructions.map((ix) => keys[ix.programIdIndex] ?? "").filter(Boolean))],
      lookupTableAccountCount: tx.message.addressTableLookups?.length ?? 0
    };
  }

  const message = tx.compileMessage();
  const requiredSigners = message.header.numRequiredSignatures;
  const signerKeys = message.accountKeys.slice(0, requiredSigners).map((key) => key.toBase58());
  const populatedSignatures = (tx.signatures ?? []).slice(0, requiredSigners).map((entry) => {
    const sig = typeof entry.signature === "string" ? Buffer.from(entry.signature) : entry.signature;
    return Boolean(sig && !isZeroSig(Uint8Array.from(sig)));
  });

  return {
    version: "legacy",
    serializedBytes,
    requiredSigners,
    feePayer: signerKeys[0] ?? null,
    signerKeys,
    populatedSignatures,
    programIds: [...new Set(tx.instructions.map((ix) => ix.programId.toBase58()))],
    lookupTableAccountCount: 0
  };
}

export async function simulateTransaction(
  tx: TransactionLike,
  rpcUrl: string,
  opts?: { replaceRecentBlockhash?: boolean }
): Promise<SimulationDiagnostics> {
  const connection = new Connection(rpcUrl, "confirmed");
  const result = await connection.simulateTransaction(tx as never, {
    replaceRecentBlockhash: opts?.replaceRecentBlockhash ?? true,
    sigVerify: false
  });

  return {
    err: result.value.err,
    logs: result.value.logs ?? [],
    unitsConsumed: result.value.unitsConsumed ?? null
  };
}

export function assertPublicKey(value: string, label: string) {
  try {
    return new PublicKey(value).toBase58();
  } catch {
    throw new Error(`${label} is not a valid Solana public key.`);
  }
}

export function decodeTransactionBase64(encoded: string): TransactionLike {
  const bytes = Buffer.from(encoded, "base64");
  try {
    return VersionedTransaction.deserialize(bytes);
  } catch {
    return Transaction.from(bytes);
  }
}
