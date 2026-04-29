"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useLesson } from "../../../../contexts/LessonContext";
import { applyCheckpointAtMasteryStart } from "../../../../lib/jump-to-mastery-checkpoint";
import { PrimaryButton } from "../../../../components/PrimaryButton";

const showDevJump =
  process.env.NEXT_PUBLIC_SHOW_LESSON_DEV_TOOLS === "true" ||
  process.env.NODE_ENV !== "production";

export default function JumpMasteryDevPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentLesson } = useLesson();
  const defaultLessonId = searchParams.get("lessonId") || currentLesson?.id || "";
  const [lessonId, setLessonId] = useState(defaultLessonId);
  const [masterySeq, setMasterySeq] = useState(
    String(searchParams.get("masterySequence") || "3")
  );
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const q = searchParams.get("lessonId");
    if (q) setLessonId(q);
    const m = searchParams.get("masterySequence");
    if (m) setMasterySeq(m);
  }, [searchParams]);

  if (!showDevJump) {
    return (
      <div className="p-8 text-white max-w-lg">
        <p>This dev tool is disabled in production.</p>
        <p className="mt-2 text-sm opacity-80">
          Set <code className="text-pink-300">NEXT_PUBLIC_SHOW_LESSON_DEV_TOOLS=true</code> in{" "}
          <code>.env.local</code> to enable.
        </p>
      </div>
    );
  }

  const missions = currentLesson?.missions as any[] | undefined;

  const onApply = async () => {
    setMessage(null);
    const id = lessonId.trim();
    const seq = parseInt(masterySeq, 10);
    if (!id) {
      setMessage("Enter lessonId (UUID).");
      return;
    }
    if (!Number.isFinite(seq) || seq < 1) {
      setMessage("Enter a valid mastery mission sequence (e.g. 3).");
      return;
    }
    if (!missions?.length) {
      setMessage(
        "No lesson missions in memory. Open this lesson from the dashboard first, or paste the same lesson JSON elsewhere — lessonId must match a lesson you have progress for."
      );
      return;
    }
    setBusy(true);
    try {
      await applyCheckpointAtMasteryStart(id, missions, seq);
      setMessage("Checkpoint updated. Opening mission page…");
      router.push(`/student/mission?lessonId=${encodeURIComponent(id)}&missionSequence=${seq}`);
    } catch (e: unknown) {
      const err = e instanceof Error ? e.message : String(e);
      setMessage(`Error: ${err}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="flex flex-col gap-4 p-8 text-white max-w-xl font-sans"
      style={{ width: "min(640px, 100%)" }}
    >
      <h1 className="text-xl font-semibold">Jump checkpoint → mastery (first word)</h1>
      <p className="text-sm opacity-85">
        Writes your server checkpoint so resume starts at <code>word_practice</code> task 0 on
        the mastery mission. Clears <code>wordProgress</code> keys for that mission’s mastery
        words so scores are fresh.
      </p>
      <label className="flex flex-col gap-1 text-sm">
        lessonId
        <input
          className="rounded border border-white/20 bg-black/40 px-3 py-2 text-white"
          value={lessonId}
          onChange={(e) => setLessonId(e.target.value)}
          placeholder="UUID from URL"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Mastery mission sequence
        <input
          className="rounded border border-white/20 bg-black/40 px-3 py-2 text-white"
          value={masterySeq}
          onChange={(e) => setMasterySeq(e.target.value)}
          placeholder="3"
        />
      </label>
      <PrimaryButton
        text={busy ? "Applying…" : "Apply & go to mission"}
        size="medium"
        variant="filled"
        onClick={onApply}
        disabled={busy}
      />
      {message && <p className="text-sm text-pink-200">{message}</p>}
      <p className="text-xs opacity-70 mt-4">
        Helper: <code>lib/jump-to-mastery-checkpoint.ts</code> — use{" "}
        <code>buildCheckpointPatchAtMasteryStart</code> if you merge checkpoints outside the app.
      </p>
    </div>
  );
}
