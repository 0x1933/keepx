"use client";

import { useEffect, useState } from "react";

export function GrainBackground() {
  const [grainUrl, setGrainUrl] = useState<string>("");

  useEffect(() => {
    // Generate fine-tuned, balanced analog film grain tile
    const size = 180;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const isWhite = Math.random() > 0.48;
      const val = isWhite ? 255 : 0;
      // Balanced alpha range (between 8 and 18) for ideal soft-textured grain
      const alpha = Math.floor(Math.random() * 10 + 8);

      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = alpha;
    }

    ctx.putImageData(imgData, 0, 0);
    setGrainUrl(canvas.toDataURL("image/png"));
  }, []);

  if (!grainUrl) return null;

  return (
    <div
      className="velvet-grain-overlay"
      style={{
        backgroundImage: `url(${grainUrl})`,
        backgroundRepeat: "repeat",
        backgroundSize: "140px 140px"
      }}
      aria-hidden="true"
    />
  );
}
