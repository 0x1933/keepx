import { NextResponse } from "next/server";

export const runtime = "nodejs";

function upstreamRpcUrl(): string {
  return (
    process.env.SOLANA_RPC_URL ||
    process.env.SOLANA_RPC ||
    process.env.NEXT_PUBLIC_SOLANA_RPC ||
    "https://api.mainnet-beta.solana.com"
  );
}

export async function POST(request: Request) {
  const body = await request.text();

  try {
    const upstream = await fetch(upstreamRpcUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      cache: "no-store",
    });

    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "RPC proxy failed";
    return NextResponse.json(
      { jsonrpc: "2.0", error: { code: -32000, message }, id: null },
      { status: 502 },
    );
  }
}
