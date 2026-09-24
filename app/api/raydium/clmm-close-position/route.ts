import { isRaydiumClmmEnabled } from "@/lib/raydium/config";
import { listClmmPositions, prepareClmmClosePosition } from "@/lib/raydium/prepare-close";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isRaydiumClmmEnabled()) {
    return Response.json({ status: "disabled", error: "Raydium CLMM is disabled." }, { status: 503 });
  }

  try {
    const url = new URL(request.url);
    const wallet = url.searchParams.get("wallet");
    if (!wallet) throw new Error("Wallet is required.");

    const poolId = url.searchParams.get("poolId") ?? undefined;
    const positions = await listClmmPositions(wallet, poolId);

    return Response.json({ status: "ok", positions });
  } catch (cause) {
    return Response.json(
      { status: "error", error: cause instanceof Error ? cause.message : "Lookup failed." },
      { status: 422 }
    );
  }
}

export async function POST(request: Request) {
  if (!isRaydiumClmmEnabled()) {
    return Response.json({ status: "disabled", error: "Raydium CLMM is disabled." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const result = await prepareClmmClosePosition({
      wallet: String(body.wallet ?? ""),
      poolId: String(body.poolId ?? ""),
      positionNftMint: String(body.positionNftMint ?? ""),
      slippageBps: body.slippageBps === undefined ? undefined : Number(body.slippageBps)
    });

    return Response.json(result);
  } catch (cause) {
    return Response.json(
      { status: "error", error: cause instanceof Error ? cause.message : "Close preparation failed." },
      { status: 422 }
    );
  }
}
