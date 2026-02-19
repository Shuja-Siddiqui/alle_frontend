"use client";

import { PathTrailCanvas } from "../../components/PathTrailCanvas";

export default function TestCanvasPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#070A28] p-8">
      <div className="w-full max-w-6xl">
        <h1
          className="pb-6 text-center text-4xl font-bold text-white"
          style={{
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "-0.4px",
          }}
        >
          Path Trail Canvas
        </h1>

        <div className="rounded-[24px] border border-[#434B93] bg-gradient-to-br from-[#0B0F37] to-[#1B1F4E] p-6">
          <PathTrailCanvas width={1100} height={650} />
        </div>
      </div>
    </div>
  );
}


