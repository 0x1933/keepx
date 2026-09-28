import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 256_000;
const UPSTREAM_TIMEOUT_MS = 20_000;

const ALLOWED_RPC_METHODS = new Set([
  "getAccountInfo",
  "getBalance",
  "getBlockHeight",
  "getEpochInfo",
  "getFeeForMessage",
  "getLatestBlockhash",
  "getMinimumBalanceForRentExemption",
  "getMultipleAccounts",
  "getProgramAccounts",
  "getRecentPrioritizationFees",
  "getSignatureStatuses",
  "getSignaturesForAddress",
  "getSlot",
  "getTokenAccountBalance",
  "getTokenAccountsByOwner",
  "getTransaction",
  "getTransactionCount",
  "isBlockhashValid",
  "sendTransaction",
  "simulateTransaction"
]);

function upstreamRpcUrl(): string {
  return (
    process.env.SOLANA_RPC_URL ||
    process.env.SOLANA_RPC ||
    process.env.NEXT_PUBLIC_SOLANA_RPC ||
    "https://api.mainnet-beta.solana.com"
  );
}

function extractMethods(payload: unknown): string[] {
  if (Array.isArray(payload)) {
    return payload.flatMap((item) => extractMethods(item));
  }
  if (payload && typeof payload === "object" && "method" in payload) {
    const method = (payload as { method?: unknown }).method;
    return typeof method === "string" ? [method] : [];
  }
  return [];
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { jsonrpc: "2.0", error: { code: -32600, message: "Request body too large." }, id: null },
      { status: 413 }
    );
  }

  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { jsonrpc: "2.0", error: { code: -32600, message: "Request body too large." }, id: null },
      { status: 413 }
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return NextResponse.json(
      { jsonrpc: "2.0", error: { code: -32700, message: "Parse error." }, id: null },
      { status: 400 }
    );
  }

  const methods = extractMethods(parsed);
  if (methods.length === 0) {
    return NextResponse.json(
      { jsonrpc: "2.0", error: { code: -32600, message: "Missing JSON-RPC method." }, id: null },
      { status: 400 }
    );
  }

  const disallowed = methods.filter((method) => !ALLOWED_RPC_METHODS.has(method));
  if (disallowed.length > 0) {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        error: { code: -32601, message: `Method not allowed: ${disallowed.join(", ")}` },
        id: null
      },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(upstreamRpcUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)
    });

    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return NextResponse.json(
      { jsonrpc: "2.0", error: { code: -32000, message: "RPC proxy failed." }, id: null },
      { status: 502 }
    );
  }
}
