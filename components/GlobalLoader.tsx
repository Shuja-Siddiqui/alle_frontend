/**
 * Global Loader Component
 * A line that shines, with an expansion pulse: center expands outward and decreases towards both ends
 */

"use client";

import { useUI } from "../contexts/UIContext";

const loaderKeyframes = `
  @keyframes loader-expand {
    0%, 100% {
      transform: scaleX(0.4);
      opacity: 0.6;
    }
    50% {
      transform: scaleX(1);
      opacity: 1;
    }
  }
`;

export function GlobalLoader() {
  const { isLoading, loadingMessage } = useUI();

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at center, #1a0e2e 0%, #0d0618 40%, #050308 100%)",
      }}
    >
      <style>{loaderKeyframes}</style>

      {/* Subtle starfield */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `radial-gradient(1.5px 1.5px at 20px 30px, rgba(255,255,255,0.4), transparent),
            radial-gradient(1.5px 1.5px at 40px 70px, rgba(255,255,255,0.3), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.5), transparent),
            radial-gradient(1.5px 1.5px at 130px 80px, rgba(255,255,255,0.3), transparent),
            radial-gradient(1px 1px at 160px 120px, rgba(255,255,255,0.4), transparent)`,
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative flex flex-col items-center gap-8 w-full px-[5%]">
        {/* Loader bar - shining line with center expansion */}
        <div className="relative flex items-center justify-center w-[90vw] max-w-[90vw] overflow-visible">
          {/* Track - base bar (dim, #484848 with blur per Figma) */}
          <div
            className="absolute left-1/2 top-1/2 h-2 w-full -translate-x-1/2 -translate-y-1/2 rounded-full origin-center"
            style={{
              background: "#484848",
              filter: "blur(7.5px)",
              opacity: 0.9,
            }}
          />
          {/* Inner line - #ff24af (Figma State 2) - expands from center, decreases towards ends */}
          <div
            className="absolute left-1/2 top-1/2 h-1 w-full -translate-x-1/2 -translate-y-1/2 rounded-full origin-center"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,36,175,0) 0%, rgba(255,36,175,0.4) 25%, #ff24af 40%, rgba(255,255,255,1) 50%, #ff24af 60%, rgba(255,36,175,0.4) 75%, rgba(255,36,175,0) 100%)",
              boxShadow: `
                0 0 8px 1px rgba(255, 36, 175, 0.6),
                inset 0 0 8px rgba(255, 255, 255, 0.5)
              `,
              animation: "loader-expand 1.8s ease-in-out infinite",
            }}
          />
          {/* Blue-purple outer halo - spindle expansion at peak */}
          <div
            className="absolute left-1/2 top-1/2 h-3 w-full -translate-x-1/2 -translate-y-1/2 rounded-full origin-center pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(138,43,226,0) 0%, rgba(138,43,226,0.3) 30%, rgba(200,50,255,0.4) 50%, rgba(138,43,226,0.3) 70%, rgba(138,43,226,0) 100%)",
              filter: "blur(6px)",
              animation: "loader-expand 1.8s ease-in-out infinite",
            }}
          />
        </div>

        {/* LOADING... text */}
        <p
          className="text-white uppercase tracking-[0.35em] font-bold text-lg"
          style={{
            fontFamily: "var(--font-orbitron), sans-serif",
            textShadow:
              "0 0 10px rgba(228, 81, 254, 0.8), 0 0 20px rgba(228, 81, 254, 0.5), 0 0 30px rgba(180, 80, 255, 0.3)",
          }}
        >
          LOADING...
        </p>

        {/* Optional message from context */}
        {loadingMessage && (
          <p
            className="text-white/80 text-sm text-center max-w-xs"
            style={{
              fontFamily: "var(--font-orbitron), sans-serif",
              textShadow: "0 0 8px rgba(228, 81, 254, 0.4)",
            }}
          >
            {loadingMessage}
          </p>
        )}
      </div>
    </div>
  );
}
