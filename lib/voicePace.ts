export interface VoicePaceRecommendation {
  atempo: number;
  slack: number;
  gainDb: number;
  paceLabel: "very_fast" | "fast" | "normal";
  durationSec: number | null;
}

async function getBlobDurationSeconds(blob: Blob): Promise<number | null> {
  try {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.preload = "metadata";

    const duration = await new Promise<number | null>((resolve) => {
      audio.onloadedmetadata = () => {
        const d = Number(audio.duration);
        resolve(Number.isFinite(d) && d > 0 ? d : null);
      };
      audio.onerror = () => resolve(null);
      audio.src = url;
    });

    URL.revokeObjectURL(url);
    return duration;
  } catch {
    return null;
  }
}

export async function recommendVoicePaceForPhoneme(
  blob: Blob
): Promise<VoicePaceRecommendation> {
  const durationSec = await getBlobDurationSeconds(blob);

  let atempo = 1;
  let paceLabel: VoicePaceRecommendation["paceLabel"] = "normal";
  if (durationSec != null) {
    if (durationSec < 0.35) {
      atempo = 0.85;
      paceLabel = "very_fast";
    } else if (durationSec < 0.55) {
      atempo = 0.92;
      paceLabel = "fast";
    }
  }

  return {
    atempo,
    slack: 0.65,
    gainDb: 0.65,
    paceLabel,
    durationSec: durationSec == null ? null : Number(durationSec.toFixed(3)),
  };
}
