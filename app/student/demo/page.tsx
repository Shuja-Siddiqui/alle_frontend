"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/PrimaryButton";
import { XpSlider } from "@/components/XpSlider";
import { MicButton } from "../lesson/components/MicButton";
import { StatusBox } from "../lesson/components/StatusBox";
import Image from "next/image";
import { useTTS } from "@/hooks/useTTS";

type StageId =
  | "alphabet_practice"
  | "word_practice"
  | "sentence_practice"
  | "mastery_check";

type DemoState =
  | "home"
  | "intro"
  | "instruction"
  | "practice";

type StatusVariant = "initial" | "default" | "success" | "error";
type CoachTarget =
  | "start-mission"
  | "start-intro"
  | "start-practice"
  | "mic"
  | "stop"
  | "refresh"
  | "next"
  | "none";

const STAGES: StageId[] = [
  "alphabet_practice",
  "word_practice",
  "sentence_practice",
  "mastery_check",
];

const STAGE_LABEL: Record<StageId, string> = {
  alphabet_practice: "Alphabet",
  word_practice: "Words",
  sentence_practice: "Sentence",
  mastery_check: "Mastery",
};

export default function StudentDemoPage() {
  const router = useRouter();
  const { playTTSWithSSML, isPlaying } = useTTS();
  const [view, setView] = useState<DemoState>("home");
  const [stageIndex, setStageIndex] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [statusVariant, setStatusVariant] = useState<StatusVariant>("initial");
  const [isMicActive, setIsMicActive] = useState(false);
  const [completedStages, setCompletedStages] = useState<StageId[]>([]);
  const [coachText, setCoachText] = useState("Tap Start mission.");
  const [coachTarget, setCoachTarget] = useState<CoachTarget>("start-mission");
  const [hasAutoPlayedInitialCoach, setHasAutoPlayedInitialCoach] = useState(false);
  const lastCoachKeyRef = useRef<string>("");

  const stage = STAGES[stageIndex];
  const stars = completedStages.length;
  const isLastStage = stageIndex === STAGES.length - 1;

  const progress = useMemo(() => {
    return Math.round((completedStages.length / STAGES.length) * 100);
  }, [completedStages.length]);

  const stageText = useMemo(() => {
    switch (stage) {
      case "alphabet_practice":
        return "S";
      case "word_practice":
        return "SAT";
      case "sentence_practice":
        return "I SEE A SUN";
      case "mastery_check":
        return "SAT";
      default:
        return "S";
    }
  }, [stage]);

  const isSuccess = statusVariant === "success";

  useEffect(() => {
    if (view !== "home" || hasAutoPlayedInitialCoach) return;

    const firstMessage =
      "This button starts your demo mission. Tap Start mission.";
    const timer = window.setTimeout(() => {
      playTTSWithSSML(firstMessage, undefined).catch(() => {
        // Ignore initial coach TTS failure and keep flow running.
      });
      setHasAutoPlayedInitialCoach(true);
    }, 450);

    return () => window.clearTimeout(timer);
  }, [view, hasAutoPlayedInitialCoach, playTTSWithSSML]);

  useEffect(() => {
    let nextText = "";
    let nextTarget: CoachTarget = "none";

    if (view === "home") {
      nextText = "This button starts your demo mission. Tap Start mission.";
      nextTarget = "start-mission";
    } else if (view === "intro") {
      nextText = "Great. Tap Start intro to hear instructions.";
      nextTarget = "start-intro";
    } else if (view === "instruction") {
      nextText = "Tap Start practice to open the speaking task.";
      nextTarget = "start-practice";
    } else if (view === "practice") {
      if (isSuccess) {
        nextText =
          "Great speaking. Tap Next step to continue, or tap refresh to try again.";
        nextTarget = "next";
      } else if (statusVariant === "default" && isMicActive) {
        nextText = "You are speaking now. Tap this button again to stop the mic.";
        nextTarget = "stop";
      } else if (statusVariant === "error") {
        nextText =
          "Try again. Tap refresh to reset, then tap mic and speak clearly.";
        nextTarget = "refresh";
      } else {
        nextText = "This is the mic button. Tap it and start speaking.";
        nextTarget = "mic";
      }
    }

    const coachKey = `${view}|${statusVariant}|${isMicActive}|${isSuccess}|${stageIndex}|${nextTarget}`;
    setCoachText(nextText);
    setCoachTarget(nextTarget);

    // Home step is handled by dedicated initial autoplay effect above.
    if (view === "home" && !hasAutoPlayedInitialCoach) {
      return;
    }

    if (coachKey !== lastCoachKeyRef.current && nextText) {
      lastCoachKeyRef.current = coachKey;
      playTTSWithSSML(nextText, undefined).catch(() => {
        // Ignore coach TTS failures to keep demo flow uninterrupted.
      });
    }
  }, [
    view,
    statusVariant,
    isMicActive,
    isSuccess,
    stageIndex,
    playTTSWithSSML,
    hasAutoPlayedInitialCoach,
  ]);

  const startMission = () => {
    setView("intro");
  };

  const startIntro = () => {
    setView("instruction");
  };

  const goToPractice = () => {
    setStatusVariant("initial");
    setIsMicActive(false);
    setView("practice");
  };

  const handleMicClick = () => {
    const nextMicState = !isMicActive;
    setIsMicActive(nextMicState);

    if (nextMicState) {
      setStatusVariant("default");
      return;
    }

    // First attempt fail, second pass, repeating pattern for demo.
    const nextAttempt = attemptCount + 1;
    setAttemptCount(nextAttempt);
    setStatusVariant(nextAttempt % 2 === 1 ? "error" : "success");
  };

  const retryCurrent = () => {
    setStatusVariant("initial");
    setIsMicActive(false);
  };

  const completeCurrentStage = () => {
    if (!completedStages.includes(stage)) {
      setCompletedStages((prev) => [...prev, stage]);
    }
  };

  const goToNextStage = () => {
    completeCurrentStage();
    if (isLastStage) {
      setView("home");
      setStageIndex(0);
      setAttemptCount(0);
      setStatusVariant("initial");
      setIsMicActive(false);
      return;
    }

    setStageIndex((prev) => prev + 1);
    setAttemptCount(0);
    setStatusVariant("initial");
    setIsMicActive(false);
    setView("intro");
  };

  const restartFullDemo = () => {
    setView("home");
    setStageIndex(0);
    setAttemptCount(0);
    setStatusVariant("initial");
    setIsMicActive(false);
    setCompletedStages([]);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-start font-sans"
      style={{
        width: "1440px",
        height: "810px",
        overflow: "hidden",
        padding: "0 32px 32px 32px",
        boxSizing: "border-box",
      }}
    >
      <div
        className="w-full flex items-center justify-between"
        style={{ marginTop: "22px" }}
      >
        <h1
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "44px",
            fontWeight: 600,
            lineHeight: "48px",
            letterSpacing: "-0.5px",
            textTransform: "uppercase",
          }}
        >
          Demo mission
        </h1>
        <PrimaryButton
          text="Back"
          iconSrc="/assets/icons/others/play.png"
          iconAlt="Back"
          iconWidth={20}
          iconHeight={20}
          size="medium"
          variant="filled"
          onClick={() => router.push("/student/profile")}
          className="demo-cta-strong"
          style={{ width: "150px", height: "58px" }}
        />
      </div>

      <div className="w-full flex items-center justify-between" style={{ marginTop: "8px" }}>
        <div className="flex items-center gap-3">
          {Array.from({ length: STAGES.length }).map((_, index) => {
            const isDone = index < stars;
            return (
              <span
                key={index}
                className={`demo-star ${isDone ? "demo-star--done" : ""}`}
                aria-label={isDone ? "Completed star" : "Pending star"}
              >
                {isDone ? "★" : "☆"}
              </span>
            );
          })}
        </div>
        <p className="demo-text-quiet">{progress}% done</p>
      </div>

      <div style={{ marginTop: "10px", width: "100%", display: "flex", justifyContent: "center" }}>
        <XpSlider
          value={completedStages.length}
          min={0}
          max={STAGES.length}
          hideNumbers
          barWidth={460}
          barHeight={32}
          batteryWidth={64}
          batteryHeight={84}
          containerHeight={84}
        />
      </div>

      <div className="demo-coach-inline" aria-live="polite">
        <span className="demo-coach-label">Coach</span>
        <p className="demo-coach-text">{coachText}</p>
        {isPlaying && <p className="demo-coach-speaking">Speaking...</p>}
      </div>

      <div
        className="demo-fade-in w-full flex justify-center"
        style={{ marginTop: "4px", minHeight: "470px" }}
      >
        <div style={{ width: "100%", maxWidth: "920px" }}>
        {view === "home" && (
          <section className="demo-center">
            <h2 className="demo-title">Start Mission</h2>
            <p className="demo-subtitle">Tap to begin your learning adventure.</p>
            <div style={{ marginTop: "10px" }}>
              <div className="demo-tap-hint demo-pointer-wrap">
                {coachTarget === "start-mission" && (
                  <span className="demo-hand-pointer demo-hand-pointer--left" aria-hidden="true">
                    👉
                  </span>
                )}
                <PrimaryButton
                  text="Start mission"
                  iconSrc="/assets/icons/others/play.png"
                  iconAlt="Start mission"
                  onClick={startMission}
                  className={`demo-cta-strong ${
                    coachTarget === "start-mission" ? "demo-coach-focus" : ""
                  }`}
                  style={{ width: "280px", height: "58px" }}
                />
              </div>
            </div>
            {completedStages.length > 0 && (
              <PrimaryButton
                text="Reset demo"
                size="medium"
                iconSrc="/assets/icons/others/play.png"
                iconAlt="Reset demo"
                variant="filled"
                onClick={restartFullDemo}
                className="demo-cta-strong"
                style={{ width: "240px", height: "58px" }}
              />
            )}
          </section>
        )}

        {view === "intro" && (
          <section className="demo-center">
            <h2 className="demo-title">{STAGE_LABEL[stage]} Intro</h2>
            <p className="demo-subtitle">Watch, listen, and then start.</p>
            <div style={{ marginTop: "10px" }}>
              <div className="demo-tap-hint demo-pointer-wrap">
                {coachTarget === "start-intro" && (
                  <span className="demo-hand-pointer demo-hand-pointer--left" aria-hidden="true">
                    👉
                  </span>
                )}
                <PrimaryButton
                  text="Start intro"
                  iconSrc="/assets/icons/others/play.png"
                  iconAlt="Start intro"
                  onClick={startIntro}
                  className={`demo-cta-strong ${
                    coachTarget === "start-intro" ? "demo-coach-focus" : ""
                  }`}
                  style={{ width: "250px", height: "58px" }}
                />
              </div>
            </div>
          </section>
        )}

        {view === "instruction" && (
          <section className="demo-center">
            <h2 className="demo-title">Agent speaks</h2>
            <p className="demo-subtitle">Listen first, then try.</p>
            <div className="demo-tap-hint demo-pointer-wrap">
              {coachTarget === "start-practice" && (
                <span className="demo-hand-pointer demo-hand-pointer--left" aria-hidden="true">
                  👉
                </span>
              )}
              <PrimaryButton
                text="Start practice"
                iconSrc="/assets/icons/others/play.png"
                iconAlt="Start practice"
                size="medium"
                onClick={goToPractice}
                className={`demo-cta-strong ${
                  coachTarget === "start-practice" ? "demo-coach-focus" : ""
                }`}
                style={{ width: "250px", height: "58px" }}
              />
            </div>
          </section>
        )}

        {view === "practice" && (
          <section className="demo-center demo-practice-layout">
            <h2 className="demo-title">{STAGE_LABEL[stage]}</h2>
            <div
              className={
                stage === "word_practice" || stage === "mastery_check"
                  ? "demo-word-box-compact"
                  : ""
              }
            >
              <StatusBox
                text={stageText}
                variant={statusVariant}
                letterWidth={stage === "alphabet_practice" ? 86 : 46}
                letterHeight={
                  stage === "alphabet_practice" ? 108 : stage === "sentence_practice" ? 42 : 96
                }
                letterGap={stage === "sentence_practice" ? 1 : stage === "alphabet_practice" ? 4 : 12}
              />
            </div>

            <div style={{ marginTop: "14px" }}>
              {isSuccess ? (
                <div className="flex items-center gap-5">
                  <div className="demo-pointer-wrap">
                  {coachTarget === "refresh" && (
                    <span className="demo-hand-pointer demo-hand-pointer--top" aria-hidden="true">
                      👇
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={retryCurrent}
                    className={`demo-refresh-btn demo-refresh-attention demo-tap-hint-soft ${
                      coachTarget === "refresh" ? "demo-coach-focus" : ""
                    }`}
                  >
                    <Image
                      src="/assets/icons/others/refresh.svg"
                      alt="Retry"
                      width={34}
                      height={34}
                    />
                  </button>
                  </div>

                  <div className="demo-tap-hint demo-pointer-wrap">
                    {coachTarget === "next" && (
                      <span className="demo-hand-pointer demo-hand-pointer--left" aria-hidden="true">
                        👉
                      </span>
                    )}
                    <PrimaryButton
                      text={isLastStage ? "Finish demo" : "Next step"}
                      iconSrc="/assets/icons/others/play.png"
                      iconAlt={isLastStage ? "Finish demo" : "Next step"}
                      size="medium"
                      onClick={goToNextStage}
                      className={`demo-cta-strong ${
                        coachTarget === "next" ? "demo-coach-focus" : ""
                      }`}
                      style={{ width: "230px", height: "58px" }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-5 justify-center">
                  {statusVariant === "error" && (
                    <div className="demo-pointer-wrap">
                    {coachTarget === "refresh" && (
                      <span className="demo-hand-pointer demo-hand-pointer--top" aria-hidden="true">
                        👇
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={retryCurrent}
                      className={`demo-refresh-btn demo-refresh-attention demo-tap-hint-soft ${
                        coachTarget === "refresh" ? "demo-coach-focus" : ""
                      }`}
                    >
                      <Image
                        src="/assets/icons/others/refresh.svg"
                        alt="Retry"
                        width={34}
                        height={34}
                      />
                    </button>
                    </div>
                  )}

                  <div className="demo-tap-hint-soft demo-mic-hint demo-pointer-wrap">
                    {(coachTarget === "mic" || coachTarget === "stop") && (
                      <span className="demo-hand-pointer demo-hand-pointer--top" aria-hidden="true">
                        👇
                      </span>
                    )}
                    <MicButton
                      icon={isMicActive ? "pause" : "mic"}
                      size={84}
                      onClick={handleMicClick}
                      className={`demo-mic-attention ${
                        coachTarget === "mic" || coachTarget === "stop"
                          ? "demo-coach-focus"
                          : ""
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            {statusVariant === "error" && (
              <p className="demo-text-quiet" style={{ marginTop: "12px" }}>
                Try again
              </p>
            )}
            {isSuccess && (
              <p className="demo-text-quiet" style={{ marginTop: "12px" }}>
                Great job
              </p>
            )}
            {attemptCount > 0 && !isSuccess && (
              <p className="demo-text-quiet" style={{ marginTop: "6px" }}>
                Attempt {attemptCount + 1}
              </p>
            )}
          </section>
        )}
        </div>
      </div>

    </div>
  );
}
