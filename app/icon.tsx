import { ImageResponse } from "next/og";

export const size = { width: 128, height: 128 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#151515" }}>
        <div style={{ width: 92, height: 92, borderRadius: 22, background: "linear-gradient(145deg, #14B8A6, #0F766E)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: "0 0 40px rgba(20,184,166,.45)" }}>
          <svg width="62" height="62" viewBox="0 0 64 64" fill="none">
            <path d="M18 14v36" stroke="white" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M18 32L46 14" stroke="white" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M28 27L46 50" stroke="white" strokeWidth="5.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    ),
    size
  );
}
