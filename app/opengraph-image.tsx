import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 70, background: "#151515", color: "#F8F8F8" }}>
        <div style={{ fontSize: 34, color: "#C2C8D2" }}>Keepx</div>
        <div style={{ fontSize: 112, lineHeight: 0.9, fontWeight: 900, marginTop: 26 }}>Keep liquidity. Own the edge.</div>
        <div style={{ marginTop: 54, height: 96, borderTop: "2px solid #444", borderBottom: "2px solid #444", position: "relative", display: "flex" }}>
          <div style={{ position: "absolute", left: "24%", top: -24, bottom: -24, width: 5, background: "#F8F8F8" }} />
          <div style={{ position: "absolute", left: "51%", top: -34, bottom: -34, width: 5, background: "#14B8A6" }} />
          <div style={{ position: "absolute", right: "18%", top: -24, bottom: -24, width: 5, background: "#F8F8F8" }} />
        </div>
      </div>
    ),
    size
  );
}
