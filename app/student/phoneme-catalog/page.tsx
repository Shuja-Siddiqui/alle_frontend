"use client";

import { useEffect, useMemo, useState } from "react";
import { MicButton } from "../lesson/components/MicButton";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { PhonemeIllustration } from "../../../components/PhonemeIllustration";
import { useSpeechAssessment } from "../../../hooks/useSpeechAssessment";
import { resolvePhonemeCode } from "../../../lib/phonemeCatalog";
import { motion } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext";

interface PhonemeChartItem {
  code: string;
  ipa: string;
  example: string;
  group?: string;
}

interface AssessmentUiResult {
  success: boolean;
  qualityScore: number;
  recognizedText?: string;
  feedbackType?: "exactMatch" | "closeMatch" | "wrongSound";
  feedbackText?: string;
  error?: string;
}

export default function PhonemeCatalogPage() {
  const {
    phonemeCatalog,
    isPhonemeCatalogLoading,
    phonemeCatalogError,
    fetchPhonemeCatalog,
  } = useAuth();
  const {
    startRecording,
    stopRecording,
    assessPhoneme,
    isRecording,
    isAssessing,
    error: recordingError,
  } = useSpeechAssessment();

  const [selectedPhoneme, setSelectedPhoneme] = useState<string>("");
  const [statusText, setStatusText] = useState<string>("");
  const [statusIsError, setStatusIsError] = useState<boolean>(false);
  const [listenLoadingCode, setListenLoadingCode] = useState<string>("");
  const [assessmentResult, setAssessmentResult] = useState<AssessmentUiResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chart = (phonemeCatalog?.chart as PhonemeChartItem[]) ?? [];
  const allowedPhonemeSet = useMemo(
    () => new Set((phonemeCatalog?.allowedCodes ?? []).map((code) => code.toUpperCase())),
    [phonemeCatalog]
  );

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

  const visibleChart = useMemo(() => {
    if (!allowedPhonemeSet.size) return [];
    return chart.filter((item) => allowedPhonemeSet.has(item.code.toUpperCase()));
  }, [chart, allowedPhonemeSet]);

  const groupSummary = useMemo(() => {
    const vowels = visibleChart.filter((item) => item.group === "vowel").length;
    const consonants = visibleChart.filter((item) => item.group === "consonant").length;
    return { vowels, consonants, total: visibleChart.length };
  }, [visibleChart]);

  useEffect(() => {
    void fetchPhonemeCatalog(false);
  }, [fetchPhonemeCatalog]);

  useEffect(() => {
    if (!visibleChart.length) {
      setSelectedPhoneme("");
      return;
    }
    const isCurrentSelectionVisible = visibleChart.some(
      (item) => item.code === selectedPhoneme
    );
    if (!isCurrentSelectionVisible) {
      setSelectedPhoneme(visibleChart[0].code);
    }
  }, [visibleChart, selectedPhoneme]);

  useEffect(() => {
    if (phonemeCatalogError) {
      setStatusText(phonemeCatalogError);
      setStatusIsError(true);
      return;
    }
    if (isPhonemeCatalogLoading) {
      setStatusText("Loading phoneme catalog...");
      setStatusIsError(false);
      return;
    }
    if (visibleChart.length > 0) {
      setStatusText("Showing mastered sounds and sounds from your current lesson.");
      setStatusIsError(false);
    } else {
      setStatusText("No unlocked phonemes yet. Complete lesson tasks to unlock sounds.");
      setStatusIsError(false);
    }
  }, [isPhonemeCatalogLoading, phonemeCatalogError, visibleChart.length]);

  const handleListen = async (phonemeCode: string) => {
    try {
      setListenLoadingCode(phonemeCode);
      setStatusText(`Loading audio for ${phonemeCode}...`);
      setStatusIsError(false);

      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
      const response = await fetch(
        `${apiBaseUrl}/testing/speech/phoneme/audio?phoneme=${encodeURIComponent(phonemeCode)}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Audio endpoint failed (${response.status})`);
      }

      const blob = await response.blob();
      if (!blob.size) {
        throw new Error("Received empty audio");
      }

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url);
      await audio.play();
      setStatusText(`Playing ${phonemeCode}.`);
      setStatusIsError(false);
    } catch (error: any) {
      setStatusText(error?.message || "Failed to play phoneme audio");
      setStatusIsError(true);
    } finally {
      setListenLoadingCode("");
    }
  };

  const handleMicClick = async () => {
    if (isSubmitting || isAssessing) return;

    if (!isRecording) {
      try {
        setAssessmentResult(null);
        setStatusText(`Recording ${selectedPhoneme}...`);
        setStatusIsError(false);
        await startRecording();
      } catch (error: any) {
        setStatusText(error?.message || "Could not start recording");
        setStatusIsError(true);
      }
      return;
    }

    try {
      setIsSubmitting(true);
      setStatusText("Analyzing with SpeechSuper...");
      setStatusIsError(false);

      const audioBlob = await stopRecording();
      const result = await assessPhoneme(audioBlob, selectedPhoneme, {
        dictType: "CMU",
        ageGroup: 1,
        slack: 0.5,
      });

      setAssessmentResult(result);
      if (result.success) {
        setStatusText(`Done. Score ${Math.round(result.qualityScore)}/100.`);
        setStatusIsError(false);
      } else {
        setStatusText(result.error || "Assessment failed");
        setStatusIsError(true);
      }
    } catch (error: any) {
      setStatusText(error?.message || "Assessment failed");
      setStatusIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const feedbackLabel = useMemo(() => {
    if (!assessmentResult?.feedbackType) return "";
    if (assessmentResult.feedbackType === "exactMatch") return "Excellent";
    if (assessmentResult.feedbackType === "closeMatch") return "Close match";
    return "Needs another try";
  }, [assessmentResult]);

  const sparkleDots = [
    { left: "6%", top: "9%", size: 10, delay: 0 },
    { left: "18%", top: "6%", size: 8, delay: 0.35 },
    { left: "34%", top: "11%", size: 12, delay: 0.15 },
    { left: "58%", top: "7%", size: 9, delay: 0.5 },
    { left: "76%", top: "10%", size: 11, delay: 0.25 },
    { left: "90%", top: "8%", size: 7, delay: 0.4 },
  ];

  return (
      <div
        className="font-sans"
        style={{
          width: "1440px",
          padding: "32px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {sparkleDots.map((dot, index) => (
        <motion.div
          key={`sparkle-${index}`}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: dot.left,
            top: dot.top,
            width: dot.size,
            height: dot.size,
            borderRadius: "999px",
            background: "radial-gradient(circle, #fff 0%, #ffd7fb 45%, rgba(255,255,255,0) 100%)",
            boxShadow: "0 0 14px rgba(255, 93, 221, 0.65)",
            pointerEvents: "none",
            zIndex: 0,
          }}
          animate={{
            y: [0, -8, 0, -4, 0],
            opacity: [0.45, 0.9, 0.6, 1, 0.45],
            scale: [1, 1.25, 1, 1.12, 1],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: dot.delay,
          }}
        />
        ))}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{
          border: "2px solid #E451FE",
          borderRadius: "20px",
          background: "linear-gradient(155deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
          padding: "24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.h1
          initial={{ opacity: 0, letterSpacing: "-0.02em" }}
          animate={{ opacity: 1, letterSpacing: "0em" }}
          transition={{ duration: 0.55, delay: 0.08 }}
          style={{
            color: "#FFF",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "44px",
            fontWeight: 600,
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Phoneme Catalog
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          style={{ color: "#C6CCFF", marginTop: "10px", marginBottom: "6px" }}
        >
          Listen. Speak. Score.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.22 }}
          style={{ color: "#9AA3E8", margin: 0, fontSize: "13px" }}
        >
          {groupSummary.total} sounds
        </motion.p>
      </motion.div>

      <div
        className="grid grid-cols-1"
        style={{
          marginTop: "20px",
          gap: "20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          style={{
            border: "1px solid #5860B8",
            borderRadius: "16px",
            background: "rgba(16, 22, 74, 0.78)",
            padding: "18px",
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: "14px" }}>
            <h2
              style={{
                color: "#FFFFFF",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "22px",
                margin: 0,
              }}
            >
              Phonemes
            </h2>

            <div className="flex items-center gap-2">
              <label htmlFor="phonemeSelect" style={{ color: "#D3D9FF", fontSize: "13px" }}>Pick</label>
              <select
                id="phonemeSelect"
                value={selectedPhoneme}
                onChange={(event) => setSelectedPhoneme(event.target.value)}
                style={{
                  background: "#0B0F37",
                  color: "#FFFFFF",
                  border: "1px solid #7A87F7",
                  borderRadius: "10px",
                  padding: "6px 10px",
                }}
              >
                {visibleChart.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
            {visibleChart.map((item) => {
              const isActive = selectedPhoneme === item.code;
              return (
                <motion.div
                  key={item.code}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedPhoneme(item.code)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedPhoneme(item.code);
                    }
                  }}
                  style={{
                    textAlign: "left",
                    borderRadius: "12px",
                    border: isActive ? "2px solid #75FF1A" : "1px solid #6670C9",
                    background: isActive ? "rgba(117, 255, 26, 0.08)" : "rgba(8, 12, 46, 0.85)",
                    color: "#FFF",
                    padding: "10px",
                    cursor: "pointer",
                  }}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: isActive ? 1.02 : 1,
                    boxShadow: isActive
                      ? "0 0 0 1px rgba(117,255,26,0.65), 0 0 16px rgba(117,255,26,0.18)"
                      : "0 0 0 0 rgba(0,0,0,0)",
                  }}
                  transition={{
                    opacity: { duration: 0.22, delay: Math.min(0.35, (visibleChart.indexOf(item) % 10) * 0.03) },
                    y: { duration: 0.22, delay: Math.min(0.35, (visibleChart.indexOf(item) % 10) * 0.03) },
                    scale: { duration: 0.18 },
                    boxShadow: { duration: 0.2 },
                  }}
                  whileHover={{ y: -4, scale: isActive ? 1.05 : 1.03, rotate: isActive ? 0.3 : 0.2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="flex items-center justify-between"
                    style={{ marginBottom: "6px", gap: "10px" }}
                    animate={
                      isActive
                        ? {
                            y: [0, -1.5, 0],
                          }
                        : {}
                    }
                    transition={
                      isActive
                        ? {
                            duration: 1.3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }
                        : undefined
                    }
                  >
                    <strong>{item.code}</strong>
                    <span style={{ color: "#AFC0FF", fontSize: "12px" }}>{item.ipa}</span>
                  </motion.div>
                  <div style={{ color: "#CDD4FF", fontSize: "12px", marginBottom: "8px" }}>
                    {item.example}
                  </div>
                  <div className="flex justify-center" style={{ marginBottom: "8px" }}>
                    <PhonemeIllustration phonemeCode={item.code} size={54} />
                  </div>
                  <PrimaryButton
                    text={listenLoadingCode === item.code ? "Loading..." : "Listen"}
                    size="medium"
                    variant="filled"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleListen(item.code);
                    }}
                    disabled={Boolean(listenLoadingCode)}
                    style={{
                      width: "100%",
                      minWidth: "unset",
                      height: "38px",
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
          {visibleChart.length === 0 && (
            <p style={{ color: "#C7CFFF", fontSize: "14px", marginTop: "14px", marginBottom: 0 }}>
              No phonemes yet.
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{
            border: "1px solid #5860B8",
            borderRadius: "16px",
            background: "rgba(16, 22, 74, 0.78)",
            padding: "18px",
          }}
        >
          <h2
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "22px",
              marginTop: 0,
              marginBottom: "10px",
            }}
          >
            Practice {selectedPhoneme || ""}
          </h2>

          <motion.p
            key={statusText}
            initial={{ opacity: 0.4, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            style={{ color: statusIsError ? "#FF9A9A" : "#CAD4FF", marginTop: 0 }}
          >
            {recordingError || statusText}
          </motion.p>

          <div className="flex items-center gap-4" style={{ marginTop: "14px", marginBottom: "18px" }}>
            <motion.div
              animate={
                isRecording
                  ? {
                      scale: [1, 1.08, 1],
                      filter: [
                        "drop-shadow(0 0 0px rgba(255, 88, 232, 0.0))",
                        "drop-shadow(0 0 10px rgba(255, 88, 232, 0.75))",
                        "drop-shadow(0 0 0px rgba(255, 88, 232, 0.0))",
                      ],
                    }
                  : {}
              }
              transition={
                isRecording
                  ? {
                      duration: 1.1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  : undefined
              }
            >
            <MicButton
              icon={isRecording ? "pause" : "mic"}
              size={96}
              onClick={handleMicClick}
              disabled={!selectedPhoneme || isSubmitting || isAssessing}
            />
            </motion.div>
            <div style={{ color: "#C8D0FF", fontSize: "14px" }}>
              {isRecording
                ? "Tap again to stop."
                : "Tap mic to start."}
            </div>
          </div>

          {assessmentResult && (
            <motion.div
              style={{
                borderRadius: "12px",
                border: "1px solid #6D79DA",
                background: "rgba(9, 13, 50, 0.9)",
                padding: "14px",
                color: "#F1F4FF",
              }}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center justify-between" style={{ gap: "12px" }}>
                <strong style={{ color: "#75FF1A" }}>{feedbackLabel}</strong>
                <motion.span
                  style={{ fontSize: "20px", fontWeight: 700 }}
                  animate={
                    assessmentResult.success
                      ? { scale: [1, 1.15, 1], color: ["#E7EEFF", "#75FF1A", "#E7EEFF"] }
                      : { scale: [1, 1.04, 1], color: ["#E7EEFF", "#FFC8C8", "#E7EEFF"] }
                  }
                  transition={{ duration: 0.7 }}
                >
                  {Math.round(assessmentResult.qualityScore)}/100
                </motion.span>
              </div>
              <p style={{ margin: "8px 0 0 0", color: "#C3CCFF", fontSize: "13px" }}>
                Heard: {assessmentResult.recognizedText || "-"}
              </p>
              {assessmentResult.feedbackText && (
                <p style={{ margin: "6px 0 0 0", color: "#E2E8FF", fontSize: "13px" }}>
                  {assessmentResult.feedbackText}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

