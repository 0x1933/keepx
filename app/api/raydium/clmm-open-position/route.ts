import { isRaydiumClmmEnabled } from "@/lib/raydium/config";
import { prepareClmmOpenPosition } from "@/lib/raydium/prepare-open";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isRaydiumClmmEnabled()) {
    return Response.json({ status: "disabled", error: "Raydium CLMM is disabled." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const result = await prepareClmmOpenPosition({
      wallet: String(body.wallet ?? ""),
      poolId: String(body.poolId ?? ""),
      lowerPrice: String(body.lowerPrice ?? ""),
      upperPrice: String(body.upperPrice ?? ""),
      baseAmount: String(body.baseAmount ?? body.depositAmount ?? ""),
      slippageBps: body.slippageBps === undefined ? undefined : Number(body.slippageBps)
    });

    return Response.json(result);
  } catch (cause) {
    return Response.json(
      { status: "error", error: cause instanceof Error ? cause.message : "Preparation failed." },
      { status: 422 }
    );
  }
}
