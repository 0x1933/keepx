import { NextResponse } from "next/server";

export const runtime = "nodejs";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

function geoFromHeaders(request: Request): {
  country: string;
  city: string;
  region: string;
} {
  return {
    country:
      request.headers.get("x-vercel-ip-country") ??
      request.headers.get("cf-ipcountry") ??
      "—",
    city: request.headers.get("x-vercel-ip-city") ?? "—",
    region: request.headers.get("x-vercel-ip-country-region") ?? "—",
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatLocation(city: string, region: string, country: string): string {
  const parts = [city, region, country].filter((part) => part && part !== "—");
  return parts.length ? parts.join(", ") : "Unknown";
}

function formatVisitTime(date: Date): string {
  return (
    date.toLocaleString("en-GB", {
      timeZone: "UTC",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }) + " UTC"
  );
}

function buildVisitMessage(params: {
  label: string;
  kind: "entry" | "navigation";
  ip: string;
  city: string;
  region: string;
  country: string;
  path: string;
  origin: string;
  referrer: string;
  ua: string;
  at: Date;
}): string {
  const { label, kind, ip, city, region, country, path, origin, referrer, ua, at } =
    params;
  const icon = kind === "navigation" ? "📄" : "👁";
  const location = formatLocation(city, region, country);

  const lines = [
    `${icon} <b>${escapeHtml(label)}</b>`,
    "━━━━━━━━━━━━━━━━━━━━",
    `🌐 <b>IP</b>       <code>${escapeHtml(ip)}</code>`,
    `📍 <b>Location</b> ${escapeHtml(location)}`,
    `🔗 <b>Path</b>     <code>${escapeHtml(path)}</code>`,
    `🏠 <b>Origin</b>   <code>${escapeHtml(origin)}</code>`,
  ];

  if (kind === "entry" || path.startsWith("/advancedSearch")) {
    lines.push(
      referrer
        ? `↩️ <b>Referrer</b> <code>${escapeHtml(referrer)}</code>`
        : "↩️ <b>Referrer</b> <i>(none detected)</i>",
    );
  }

  lines.push(
    `🖥 <b>Agent</b>    <code>${escapeHtml(ua)}</code>`,
    `🕐 <b>Time</b>     ${escapeHtml(formatVisitTime(at))}`,
  );

  return lines.join("\n");
}

async function sendTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  const telegramRes = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text.slice(0, 3900),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    },
  );
  if (!telegramRes.ok) {
    const detail = await telegramRes.text().catch(() => "");
    console.error("[telegram] send failed", telegramRes.status, detail);
    return false;
  }
  return true;
}

type VisitBody = {
  path?: string;
  origin?: string;
  referrer?: string;
  kind?: "entry" | "navigation";
};

export async function POST(request: Request) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    return NextResponse.json({ ok: false, reason: "unset" }, { status: 204 });
  }

  let path = "/";
  let origin = "";
  let referrer = "";
  let kind: VisitBody["kind"] = "entry";

  try {
    const raw = (await request.json()) as VisitBody;
    if (typeof raw.path === "string" && raw.path.startsWith("/")) {
      path = raw.path.slice(0, 300);
    }
    if (typeof raw.origin === "string") {
      origin = raw.origin.slice(0, 500);
    }
    if (typeof raw.referrer === "string") {
      referrer = raw.referrer.slice(0, 500);
    }
    if (raw.kind === "navigation") {
      kind = "navigation";
    }
  } catch {
    return NextResponse.json(
      { ok: false, reason: "bad_payload" },
      { status: 400 },
    );
  }

  const ip = clientIp(request);
  const ua = request.headers.get("user-agent")?.slice(0, 400) ?? "unknown";
  const { country, city, region } = geoFromHeaders(request);
  const host = request.headers.get("host");
  if (!origin && host) {
    origin = `https://${host}${path}`;
  }
  const baseLabel = process.env.VISIT_REPORT_LABEL?.trim() || "Site visit";
  const label =
    kind === "navigation" ? `${baseLabel} — page view` : baseLabel;

  const text = buildVisitMessage({
    label,
    kind,
    ip,
    city,
    region,
    country,
    path,
    origin,
    referrer,
    ua,
    at: new Date(),
  });

  const ok = await sendTelegram(text);
  return NextResponse.json({ ok }, { status: ok ? 200 : 502 });
}
