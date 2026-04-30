"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type DailyStreakDialogProps = {
  isOpen: boolean;
  streakDays: number;
  maxStreak?: number;
  openFrom?: { x: number; y: number } | null;
  motivationalLine?: string;
  nextReward?: string | null;
  isLoading?: boolean;
  errorMessage?: string;
  onClose?: () => void;
  onContinue?: () => void;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
};

export function DailyStreakDialog({
  isOpen,
  streakDays,
  maxStreak = 0,
  openFrom = null,
  isLoading = false,
  errorMessage,
  onClose,
  title = "Daily Streak",
}: DailyStreakDialogProps) {
  const [animatedStreakDays, setAnimatedStreakDays] = useState(0);

  useEffect(() => {
    if (!isOpen || isLoading) {
      setAnimatedStreakDays(0);
      return;
    }

    const target = Math.max(streakDays, 0);
    const durationMs = 900;
    const startTime = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedStreakDays(Math.round(target * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isOpen, isLoading, streakDays]);

  if (!isOpen) return null;
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const activeWeekDays = isLoading ? 0 : Math.min(Math.max(streakDays, 0), weekDays.length);
  const flyFromX =
    typeof window !== "undefined" && openFrom ? openFrom.x - window.innerWidth / 2 : 0;
  const flyFromY =
    typeof window !== "undefined" && openFrom ? openFrom.y - window.innerHeight / 2 : 14;

  return (
    <div className="streak-backdrop fixed inset-0 z-100 flex items-center justify-center bg-[#05051bcc]/80 p-4">
      <div
        className="streak-dialog-card relative w-full max-w-[520px] rounded-[34px] border border-[#ffffff3d] p-6 shadow-[0_0_45px_rgba(228,81,254,0.3)] md:p-8"
        style={{
          ["--fly-x" as string]: `${flyFromX}px`,
          ["--fly-y" as string]: `${flyFromY}px`,
          background:
            "linear-gradient(168.78deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
          backgroundImage:
            "url('/assets/icons/others/circle_bg.svg'), linear-gradient(168.78deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
          backgroundSize: "cover, cover",
          backgroundPosition: "center, center",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 h-9 w-9 cursor-pointer rounded-full border border-[#ffffff66] text-white transition hover:bg-white/10"
          aria-label="Close daily streak dialog"
        >
          x
        </button>

        <div className="mb-4 flex items-center justify-center">
          <Image
            src="/assets/icons/others/daily-streak-flame.svg"
            alt="Daily streak flame"
            width={88}
            height={88}
            priority
          />
        </div>

        <h2
          className="text-center"
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "34px",
            fontWeight: 700,
            letterSpacing: "-0.4px",
            textTransform: "uppercase",
          }}
        >
          {title}
        </h2>

        <div className="mt-6 rounded-[24px] border border-[#ffffff2e] bg-[#101646] px-5 py-4">
          <p
            className="text-center"
            style={{
              color: "#F7F8FF",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
            }}
          >
            Current Streak
          </p>
          <div className="mt-2 flex items-end justify-center gap-2">
            <span
              style={{
                color: "#E451FE",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "58px",
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {isLoading ? "--" : animatedStreakDays}
            </span>
            <span
              className="pb-2"
              style={{
                color: "#FFFFFF",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "0.2px",
                textTransform: "uppercase",
              }}
            >
              DAYS
            </span>
          </div>
          <p
            className="mt-2 text-center"
            style={{
              color: "#EFA5FF",
              fontSize: "14px",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontWeight: 600,
              letterSpacing: "0.3px",
              textTransform: "uppercase",
            }}
          >
            Best Streak:{" "}
            <span
              style={{
                color: "#FFFFFF",
                fontWeight: 700,
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              }}
            >
              {isLoading ? "--" : maxStreak}
            </span>{" "}
            <span style={{ color: "#E451FE", fontWeight: 700 }}>DAYS</span>
          </p>
        </div>

        <div className="mt-4 rounded-[20px] border border-[#E451FE66] bg-[#0e1440] px-3 py-3">
          <p
            className="mb-3 text-center"
            style={{
              color: "#E451FE",
              fontSize: "14px",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontWeight: 700,
            }}
          >
            This Week
          </p>
          <div className="mt-1 flex items-start justify-between">
            {weekDays.map((day, index) => {
              const active = index < activeWeekDays;
              const connectorActive = index < activeWeekDays - 1;
              const isLastDay = index === weekDays.length - 1;

              return (
                <div
                  key={day}
                  className={isLastDay ? "flex min-w-0 items-start" : "flex min-w-0 flex-1 items-start"}
                >
                  <div className="flex w-[36px] shrink-0 flex-col items-center">
                    <div
                      className={`relative streak-item-fly-in ${active ? "streak-icon-active" : ""}`}
                      style={{ animationDelay: `${180 + index * 90}ms` }}
                    >
                      {active && (
                        <>
                          <span className="sparkle sparkle-a" />
                          <span className="sparkle sparkle-b" />
                          <span className="sparkle sparkle-c" />
                        </>
                      )}
                      <Image
                        src="/assets/icons/others/daily-streak-flame.svg"
                        alt={`${day} streak status`}
                        width={18}
                        height={18}
                        style={{ opacity: active ? 1 : 0.28 }}
                      />
                    </div>
                    <span
                      className="streak-item-fly-in mt-1"
                      style={{
                        animationDelay: `${240 + index * 90}ms`,
                        color: active ? "#FFFFFF" : "#9FA7F5",
                        fontSize: "12px",
                        fontWeight: 700,
                        fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                        letterSpacing: "0.2px",
                      }}
                    >
                      {day}
                    </span>
                  </div>

                  {index < weekDays.length - 1 && (
                    <div className="mt-[8px] h-[4px] flex-1 rounded-full bg-[#2D3469]">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          connectorActive ? "connector-fill-active" : ""
                        }`}
                        style={{
                          width: connectorActive ? "100%" : "0%",
                          background: "linear-gradient(90deg, #E451FE 0%, #FF00CA 100%)",
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {!!errorMessage && (
          <p className="mt-3 text-center" style={{ color: "#FF98D5", fontSize: "13px" }}>
            {errorMessage}
          </p>
        )}

        <style jsx>{`
          .streak-backdrop {
            animation: backdropIn 260ms ease-out;
          }

          .streak-dialog-card {
            animation: dialogPopIn 340ms cubic-bezier(0.22, 1, 0.36, 1);
            transform-origin: center;
          }

          .streak-icon-active {
            animation: iconBob 1.8s ease-in-out infinite;
            filter: drop-shadow(0 0 6px rgba(228, 81, 254, 0.75));
          }

          .streak-item-fly-in {
            opacity: 0;
            animation: streakItemFlyIn 520ms cubic-bezier(0.19, 1, 0.22, 1) forwards;
          }

          .sparkle {
            position: absolute;
            width: 5px;
            height: 5px;
            border-radius: 999px;
            background: #ffd6f9;
            box-shadow: 0 0 8px rgba(255, 130, 228, 0.95);
            animation: sparklePop 1.4s ease-in-out infinite;
            pointer-events: none;
          }

          .sparkle-a {
            top: -7px;
            left: -5px;
          }

          .sparkle-b {
            top: -9px;
            right: -5px;
            animation-delay: 0.35s;
          }

          .sparkle-c {
            bottom: 2px;
            right: -7px;
            animation-delay: 0.7s;
          }

          .connector-fill-active {
            position: relative;
            overflow: hidden;
          }

          .connector-fill-active::after {
            content: "";
            position: absolute;
            top: 0;
            left: -40%;
            width: 40%;
            height: 100%;
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.65) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            animation: barShine 1.8s linear infinite;
          }

          @keyframes iconBob {
            0%,
            100% {
              transform: translateY(0) scale(1);
            }
            50% {
              transform: translateY(-2px) scale(1.07);
            }
          }

          @keyframes backdropIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes streakItemFlyIn {
            0% {
              opacity: 0;
              transform: translateY(20px) scale(0.75) rotate(-10deg);
            }
            70% {
              opacity: 1;
              transform: translateY(-2px) scale(1.05) rotate(2deg);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1) rotate(0deg);
            }
          }

          @keyframes dialogPopIn {
            0% {
              opacity: 0;
              transform: translate(var(--fly-x), var(--fly-y)) scale(0.35);
            }
            70% {
              opacity: 1;
              transform: translateY(-2px) scale(1.02);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes sparklePop {
            0%,
            100% {
              opacity: 0.25;
              transform: scale(0.6);
            }
            50% {
              opacity: 1;
              transform: scale(1.25);
            }
          }

          @keyframes barShine {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(300%);
            }
          }
        `}</style>
      </div>
    </div>
  );
}

