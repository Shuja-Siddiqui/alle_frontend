"use client";

import Image from "next/image";

type LevelMapProps = {
  /** Kept for compatibility with existing calls; not used for now */
  totalLevels: number;
  xpPerLevel: number;
  currentXp: number;
  width?: number;
  height?: number;
  onLevelClick?: (level: number) => void;
};

/**
 * Temporary LevelMap: just renders the static Map.svg
 * at the requested absolute position and size.
 */
export function LevelMap(_props: LevelMapProps) {
  return (
    <div style={{
      position: "absolute",
      width: "886px",
      height: "619px",
      top: "-60px",
      left: "-30px",
      opacity: 1,
      transform: "rotate(0deg)",
    }}>
      <Image
        src="/assets/icons/others/Map.svg"
        alt="Level map"
        width={900}
        height={619}

      />
    </div>
  );
}
