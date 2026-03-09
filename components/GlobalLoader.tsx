/**
 * Global Loader Component
 * Lightsaber-style loading bar with illuminated glow (Star Wars inspired)
 * Displays when UI context isLoading is true
 */

"use client";

import { useUI } from "../contexts/UIContext";

export function GlobalLoader() {
  const { isLoading, loadingMessage } = useUI();

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at center, #1a0e2e 0%, #0d0618 40%, #050308 100%)",
      }}
    >
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
        {/* Lightsaber blade container - 90% viewport width */}
        <div className="relative flex items-center justify-center w-[90vw] max-w-[90vw]">
          {/* Outer glow */}
          <div
            className="absolute h-4 w-full rounded-full animate-pulse"
            style={{
              background: "transparent",
              boxShadow: `
                0 0 20px 4px rgba(138, 43, 226, 0.5),
                0 0 40px 12px rgba(200, 50, 255, 0.35),
                0 0 60px 20px rgba(228, 81, 254, 0.25),
                0 0 80px 28px rgba(180, 80, 255, 0.15),
                inset 0 0 30px 2px rgba(255, 200, 255, 0.2)
              `,
            }}
          />
          {/* Mid glow */}
          <div
            className="absolute h-2 w-[96%] rounded-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(100, 50, 255, 0.9) 0%, rgba(228, 81, 254, 0.95) 35%, rgba(255, 120, 255, 0.95) 65%, rgba(160, 80, 255, 0.9) 100%)",
              boxShadow: `
                0 0 15px 2px rgba(228, 81, 254, 0.8),
                inset 0 0 12px 0 rgba(255, 255, 255, 0.4)
              `,
            }}
          />
          {/* Bright core */}
          <div
            className="absolute h-1 w-[92%] rounded-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,220,255,0.98) 50%, rgba(255,255,255,0.95) 100%)",
              boxShadow: "inset 0 0 8px rgba(255,255,255,0.9)",
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
