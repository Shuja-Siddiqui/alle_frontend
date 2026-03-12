"use client";

import { useState, useEffect, useRef } from "react";

export type LessonMapState = "active" | "closed" | "completed";

type LevelMapProps = {
  totalLevels?: number;
  xpPerLevel?: number;
  currentXp?: number;
  width?: number;
  height?: number;
  onLevelClick?: (level: number) => void;
  /**
   * Per-lesson state for the map nodes.
   * Keys: lesson id matching SVG (e.g. "lesson01", "lesson02").
   * Values: which variant to show (active = current, closed = locked, completed = done).
   * Lessons not in this map default to "closed".
   */
  lessonStates?: Record<string, LessonMapState>;
  /**
   * Convenience: current lesson id (e.g. "lesson01"). Builds lessonStates with this as "active".
   */
  activeLessonId?: string | null;
  /**
   * Convenience: lesson ids that are completed (e.g. ["lesson01", "lesson02"]).
   * Ignored if lessonStates is provided.
   */
  completedLessonIds?: string[];
};

/**
 * LevelMap: renders Map.svg inline and shows active/closed/completed per lesson
 * by toggling visibility of groups with ids: lessonNN/active, lessonNN/closed, lessonNN/completed.
 *
 * In Figma, export one SVG where each lesson node has three groups with those IDs
 * so we can switch which one is visible.
 */
export function LevelMap({
  lessonStates: lessonStatesProp,
  activeLessonId,
  completedLessonIds = [],
  ..._rest
}: LevelMapProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const lessonStates: Record<string, LessonMapState> =
    lessonStatesProp != null && Object.keys(lessonStatesProp).length > 0
      ? lessonStatesProp
      : (() => {
          const s: Record<string, LessonMapState> = {};
          completedLessonIds.forEach((id) => (s[id] = "completed"));
          if (activeLessonId) s[activeLessonId] = "active";
          return s;
        })();

  // Load Map.svg so we can control visibility of internal groups
  useEffect(() => {
    let cancelled = false;
    fetch("/assets/icons/others/Map.svg")
      .then((r) => r.text())
      .then((text) => {
        if (!cancelled) setSvgContent(text);
      })
      .catch((err) => console.error("[LevelMap] Failed to load Map.svg", err));
    return () => {
      cancelled = true;
    };
  }, []);

  // Apply visibility per lesson; create "completed" by cloning lesson01/active when missing
  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    const root = containerRef.current;
    const svg = root.querySelector("svg");
    if (!svg) return;

    const states: LessonMapState[] = ["active", "closed", "completed"];

    // Discover lesson IDs from the SVG
    const lessonIdSet = new Set<string>();
    root.querySelectorAll("[id^='lesson']").forEach((el) => {
      const id = el.getAttribute("id");
      if (!id) return;
      const base = id.split("/")[0];
      if (/^lesson\d+$/.test(base)) lessonIdSet.add(base);
    });

    const lessonIds = Array.from(lessonIdSet).sort((a, b) => {
      const n1 = parseInt(a.replace("lesson", ""), 10);
      const n2 = parseInt(b.replace("lesson", ""), 10);
      return n1 - n2;
    });

    const effectiveStates = Object.keys(lessonStates).length > 0
      ? lessonStates
      : { lesson01: "active" as const };

    const template = root.querySelector("[id='lesson01/active']") as SVGGElement | null;
    const getCenter = (el: Element) => {
      const box = (el as SVGGraphicsElement).getBBox?.();
      if (box) return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
      return { x: 0, y: 0 };
    };

    // Create "completed" by cloning lesson01/active for lessons that need it but don't have it
    lessonIds.forEach((lessonId) => {
      const desiredState = effectiveStates[lessonId] ?? "closed";
      if (desiredState !== "completed") return;

      const completedEl = root.querySelector(`[id="${lessonId}/completed"]`);
      if (completedEl) return;

      const existingEl = root.querySelector(`[id="${lessonId}/closed"]`) || root.querySelector(`[id="${lessonId}/active"]`);
      const parentGroup = root.querySelector(`[id="${lessonId}"]`);
      if (!template || !parentGroup || !existingEl) return;

      const templateCenter = getCenter(template);
      const targetCenter = getCenter(existingEl);
      const dx = targetCenter.x - templateCenter.x;
      const dy = targetCenter.y - templateCenter.y;

      const clone = template.cloneNode(true) as SVGGElement;
      clone.setAttribute("id", `${lessonId}/completed`);
      clone.style.display = "block";
      clone.setAttribute("transform", `translate(${dx}, ${dy})`);

      parentGroup.appendChild(clone);
    });

    // Apply visibility
    const fallbackOrder: LessonMapState[] = ["active", "completed", "closed"];
    lessonIds.forEach((lessonId) => {
      const desiredState = effectiveStates[lessonId] ?? "closed";
      const desiredEl = root.querySelector(`[id="${lessonId}/${desiredState}"]`) as HTMLElement | null;
      const stateToShow = desiredEl ? desiredState : fallbackOrder.find((s) => root.querySelector(`[id="${lessonId}/${s}"]`)) ?? desiredState;

      states.forEach((s) => {
        const el = root.querySelector(`[id="${lessonId}/${s}"]`) as HTMLElement | null;
        if (el) el.style.display = s === stateToShow ? "block" : "none";
      });
    });
  }, [svgContent, lessonStates]);

  if (!svgContent) {
    return (
      <div
        style={{
          position: "absolute",
          width: 886,
          height: 619,
          top: -60,
          left: -30,
          background: "rgba(0,0,0,0.1)",
          borderRadius: 8,
        }}
        aria-label="Level map loading"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        width: 886,
        height: 619,
        top: -60,
        left: -30,
        opacity: 1,
        transform: "rotate(0deg)",
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      aria-label="Level map"
    />
  );
}
