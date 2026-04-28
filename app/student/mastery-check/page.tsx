"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PrimaryButton } from "../../../components/PrimaryButton";
import Image from "next/image";
import { motion } from "framer-motion";
import { StudentMascotAvatar } from "../../../components/StudentMascotAvatar";
import { starsFromCorrectTotal } from "../../../lib/score-stars";
import { resolveMasteryCheckScoreFromApis } from "../../../lib/mastery-check-resolve-score";
import { api } from "../../../lib/api-client";

function parseNonNegativeInt(value: string | null): number | null {
    if (value == null) return null;
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed < 0) return null;
    return parsed;
}

export default function MasteryCheckPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const lessonId = searchParams.get("lessonId");
    const missionSequenceRaw = searchParams.get("missionSequence");
    const missionSequence =
        missionSequenceRaw != null ? Number.parseInt(missionSequenceRaw, 10) : Number.NaN;

    const queryCorrect = parseNonNegativeInt(searchParams.get("correct"));
    const queryTotal = parseNonNegativeInt(searchParams.get("total"));
    const hasQueryScore = queryCorrect !== null && queryTotal !== null;
    const hasOnlyOneQueryScore = (queryCorrect !== null) !== (queryTotal !== null);

    const scoreFromUrl = useMemo(() => {
        if (hasQueryScore && queryCorrect !== null && queryTotal !== null) {
            return { correct: queryCorrect, total: queryTotal };
        }
        return null;
    }, [hasQueryScore, queryCorrect, queryTotal]);

    const [fetchedScore, setFetchedScore] = useState<{ correct: number; total: number } | null>(
        null
    );
    const [scoreError, setScoreError] = useState<string | null>(null);

    useEffect(() => {
        if (scoreFromUrl) {
            setFetchedScore(null);
            setScoreError(null);
            return;
        }
        if (!lessonId || !Number.isFinite(missionSequence) || missionSequence < 1 || hasOnlyOneQueryScore) {
            setFetchedScore(null);
            setScoreError("Missing or invalid mastery-check parameters.");
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const [progRes, lessonRes] = await Promise.all([
                    api.get<any>(`/lessons/${lessonId}/progress`),
                    api.get<any>(`/lessons/${lessonId}`),
                ]);
                const checkpoint =
                    progRes?.data?.checkpoint ?? progRes?.checkpoint ?? null;
                const score = resolveMasteryCheckScoreFromApis({
                    lessonPayload: lessonRes,
                    missionSequence,
                    checkpoint,
                });
                if (!cancelled) {
                    setFetchedScore(score);
                    setScoreError(null);
                }
            } catch (e: unknown) {
                if (!cancelled) {
                    setFetchedScore(null);
                    setScoreError(e instanceof Error ? e.message : "Unable to resolve real mastery score.");
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [lessonId, missionSequence, scoreFromUrl, hasOnlyOneQueryScore]);

    const displayScores = scoreFromUrl ?? fetchedScore;
    const scoreReady = displayScores !== null && scoreError === null;
    const currentScore = displayScores?.correct ?? 0;
    const totalScore = displayScores?.total ?? 0;
    const starsEarned = scoreReady ? starsFromCorrectTotal(currentScore, totalScore) : 0;
    const continueTo = searchParams.get("continueTo");
    const retryTo = searchParams.get("retryTo");
    const [animatedCorrectScore, setAnimatedCorrectScore] = useState(0);
    const [startCorrectCount, setStartCorrectCount] = useState(false);

    useEffect(() => {
        if (!startCorrectCount) {
            setAnimatedCorrectScore(0);
            return;
        }

        let frameId = 0;
        const durationMs = 900;
        const startTime = performance.now();
        const target = Math.max(0, currentScore);

        const tick = (now: number) => {
            const progress = Math.min((now - startTime) / durationMs, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            setAnimatedCorrectScore(Math.round(target * eased));
            if (progress < 1) {
                frameId = requestAnimationFrame(tick);
            }
        };

        setAnimatedCorrectScore(0);
        frameId = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frameId);
    }, [currentScore, startCorrectCount]);

    useEffect(() => {
        setStartCorrectCount(false);
        setAnimatedCorrectScore(0);
    }, [lessonId, missionSequence, currentScore, totalScore]);

    return (
        <div
            className="relative flex flex-col items-center justify-center font-sans"
            style={{
                width: "1440px",
                height: "calc(100vh - 40px - 60.864px)",
                padding: "0 32px 32px 32px", // No top padding, 32px on other sides
            }}
        >
            {/* Center Content */}
            <div className="flex flex-col items-center justify-center gap-8">
                {/* 5 Stars - Show earned stars */}
                <div className="flex items-center gap-4 shrink-0">
                    {Array.from({ length: 5 }).map((_, index) => {
                        const isEarned = index < starsEarned;
                        return (
                            <motion.div
                                key={index}
                                initial={isEarned ? { x: -90, y: -260, scale: 0.65, opacity: 0, rotate: -24 } : { opacity: 0 }}
                                animate={
                                    isEarned
                                        ? {
                                            x: [-90, -38, 10, 0],
                                            y: [-260, -150, -48, 0],
                                            scale: [0.65, 0.84, 1.08, 1],
                                            opacity: [0, 0.72, 1, 1],
                                            rotate: [-24, -10, 5, 0],
                                        }
                                        : { opacity: 0.3 }
                                }
                                transition={
                                    isEarned
                                        ? { duration: 0.85, ease: "easeOut", delay: 0.2 + index * 0.12 }
                                        : { duration: 0.35, delay: 0.2 + index * 0.05 }
                                }
                                style={{
                                    width: "108px",
                                    height: "108px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "relative",
                                    opacity: isEarned ? 1 : 0.3, // Dim unearned stars
                                    overflow: "visible",
                                }}
                            >
                                {isEarned && (
                                    <>
                                        {/* Pink bloom behind star */}
                                        <motion.div
                                            style={{
                                                position: "absolute",
                                                width: "120px",
                                                height: "120px",
                                                borderRadius: "50%",
                                                background: "rgba(228, 81, 254, 0.3)",
                                                filter: "blur(52px)",
                                                zIndex: 0,
                                            }}
                                            initial={{ opacity: 0.8 }}
                                            animate={{ opacity: [0.8, 1, 0.8] }}
                                            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: index * 0.05 }}
                                        />

                                        {/* Blue dodge-style highlight */}
                                        <motion.div
                                            style={{
                                                position: "absolute",
                                                left: "56%",
                                                top: "42%",
                                                transform: "translate(-50%, -50%)",
                                                width: "52px",
                                                height: "52px",
                                                borderRadius: "50%",
                                                background: "rgba(122, 148, 255, 0.45)",
                                                mixBlendMode: "color-dodge",
                                                filter: "blur(20px)",
                                                zIndex: 0,
                                            }}
                                            initial={{ opacity: 0.8 }}
                                            animate={{ opacity: [0.8, 1, 0.8] }}
                                            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.08 + index * 0.05 }}
                                        />
                                    </>
                                )}

                                {isEarned && (
                                    <motion.div
                                        style={{
                                            width: "84px",
                                            height: "82px",
                                            overflow: "hidden",
                                            position: "relative",
                                            zIndex: 1,
                                        }}
                                        initial={{ scale: 0.2 }}
                                        animate={{ scale: [0.2, 1.2, 1] }}
                                        transition={{ duration: 0.45, delay: 0.28 + index * 0.12 }}
                                    >
                                        <Image
                                            src="/assets/icons/others/star.svg"
                                            alt="Star"
                                            width={84}
                                            height={82}
                                            style={{
                                                position: "absolute",
                                                left: "50%",
                                                top: "50%",
                                                transform: "translate(-50%, -50%)",
                                                width: "84px",
                                                height: "82px",
                                                objectFit: "cover",
                                                objectPosition: "center center",
                                            }}
                                        />
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Score Display */}
                <div className="flex items-center gap-2">
                    {scoreError ? (
                        <div
                            style={{
                                color: "#FF8EA4",
                                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                                fontSize: "24px",
                                textAlign: "center",
                                maxWidth: "860px",
                            }}
                        >
                            {scoreError}
                        </div>
                    ) : (
                        <>
                    <motion.span
                        style={{
                            color: "#FF51D4",
                            textAlign: "center",
                            textShadow: "0 0 0 #E451FE",
                            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                            fontSize: "96px",
                            fontStyle: "normal",
                            fontWeight: 600,
                            lineHeight: "102px",
                            letterSpacing: "-1.056px",
                            textTransform: "uppercase",
                        }}
                        initial={{ x: -220, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 130, damping: 16, delay: 1.05 }}
                    >
                        {scoreReady ? animatedCorrectScore : "…"}
                    </motion.span>
                    <motion.span
                        style={{
                            color: "#FFF",
                            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                            fontSize: "96px",
                            fontStyle: "normal",
                            fontWeight: 600,
                            lineHeight: "102px",
                            letterSpacing: "-1.056px",
                            textTransform: "uppercase",
                        }}
                        initial={{ scale: 0.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.9 }}
                    >
                        /
                    </motion.span>
                    <motion.span
                        style={{
                            color: "#FFF",
                            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                            fontSize: "96px",
                            fontStyle: "normal",
                            fontWeight: 600,
                            lineHeight: "102px",
                            letterSpacing: "-1.056px",
                            textTransform: "uppercase",
                        }}
                        initial={{ x: 220, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 130, damping: 16, delay: 1.18 }}
                        onAnimationComplete={() => {
                            if (scoreReady) setStartCorrectCount(true);
                        }}
                    >
                        {scoreReady ? totalScore : "…"}
                    </motion.span>
                        </>
                    )}
                </div>

                {/* Retry + Continue Buttons */}
                <motion.div
                    className="flex items-center gap-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 1.15 }}
                >
                    <motion.button
                        type="button"
                        onClick={() =>
                            router.push(
                                retryTo
                                    ? decodeURIComponent(retryTo)
                                    : `/student/mission?lessonId=${lessonId}&missionSequence=${missionSequence}`
                            )
                        }
                        style={{
                            display: "flex",
                            width: "70px",
                            height: "70px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "4px",
                            borderRadius: "76.829px",
                            border: "2px solid #F529F9",
                            boxShadow: "0 0 0 1.602px #E451FE",
                            background: "transparent",
                            cursor: "pointer",
                        }}
                        aria-label="Retry lesson"
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                        >
                            <Image
                                src="/assets/icons/others/refresh.svg"
                                alt="Refresh"
                                width={43.82}
                                height={43.82}
                            />
                        </motion.div>
                    </motion.button>
                    <PrimaryButton
                        text="Continue"
                        iconSrc="/assets/icons/others/play.png"
                        iconAlt="Continue"
                        size="medium"
                        variant="filled"
                        onClick={() =>
                            router.push(continueTo ? decodeURIComponent(continueTo) : "/student/dashboard")
                        }
                    />
                </motion.div>
            </div>

            {/* Mascot Avatar - Left Bottom like other student pages */}
            <motion.div
                className="absolute"
                style={{
                    left: "32px",
                    bottom: "32px",
                }}
                initial={{ y: 160, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.65 }}
            >
                <StudentMascotAvatar size={204.688} />
            </motion.div>
        </div>
    );
}

