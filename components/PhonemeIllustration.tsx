"use client";

import { getPhonemeIllustration } from "../lib/phonemeIllustrations";

type PhonemeIllustrationProps = {
  phonemeCode: string;
  size?: number;
};

export function PhonemeIllustration({ phonemeCode, size = 44 }: PhonemeIllustrationProps) {
  const icon = getPhonemeIllustration(phonemeCode);

  return (
    <img
      src={icon.cdnUrl}
      alt={icon.label}
      width={size}
      height={size}
      title={icon.label}
      aria-label={icon.label}
      style={{
        objectFit: "contain",
        filter:
          "grayscale(1) contrast(1.18) brightness(1.08) sepia(1) hue-rotate(285deg) saturate(4.2)",
        opacity: 0.98,
        display: "block",
      }}
      loading="lazy"
    />
  );
}

