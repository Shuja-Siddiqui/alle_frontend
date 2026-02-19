"use client";

import { useEffect, useRef, useState } from "react";

type LevelMapProps = {
  /** Total number of levels */
  totalLevels: number;
  /** XP required per level */
  xpPerLevel: number;
  /** Current total XP of the student */
  currentXp: number;
  /** Width of the map container */
  width?: number;
  /** Height of the map container */
  height?: number;
  /** Optional callback when a level is clicked */
  onLevelClick?: (level: number) => void;
};

/**
 * Level Map component for student home page
 * Uses the Map.svg file and dynamically shows/hides stars and locks based on XP
 */
export function LevelMap({
  totalLevels,
  xpPerLevel,
  currentXp,
  width = 846,
  height = 619,
  onLevelClick,
}: LevelMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");

  // Calculate unlocked levels
  const unlockedLevels = Math.floor(currentXp / xpPerLevel);
  const maxUnlockedLevel = Math.min(unlockedLevels, totalLevels);

  // Load the SVG file
  useEffect(() => {
    fetch("/assets/icons/others/Map.svg")
      .then((res) => res.text())
      .then((text) => setSvgContent(text))
      .catch((err) => console.error("Failed to load Map.svg:", err));
  }, []);

  // Update SVG based on unlocked levels
  useEffect(() => {
    if (!containerRef.current || !svgContent) return;

    const container = containerRef.current;
    
    // Create a temporary container to parse the SVG
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = svgContent;
    const svgElement = tempDiv.querySelector("svg");
    
    if (!svgElement) return;

    // Get all direct children of SVG (in document order)
    const allChildren = Array.from(svgElement.children);
    
    // Find the main path (connecting line)
    const mainPath = allChildren.find(
      (el) => el.tagName === "path" && el.getAttribute("stroke")?.includes("22528C")
    ) as SVGPathElement | undefined;

    // Collect all level markers in document order
    const levelMarkers: Array<{
      levelNumber: number;
      starRect?: Element;
      starPath?: Element;
      lockPath?: Element;
      lockRect?: Element;
      type: "star" | "lock";
    }> = [];

    let levelCounter = 1;
    
    // Process all children in order
    for (let i = 0; i < allChildren.length; i++) {
      const element = allChildren[i];
      
      // Skip the main path, filters, defs, and groups (except for special cases)
      if (element === mainPath || element.tagName === "defs") {
        continue;
      }
      
      // Skip filter groups (they contain circles for the highlighted star)
      if (element.tagName === "g" && element.getAttribute("filter")) {
        continue;
      }
      
      // Check if it's a star rect (rect with gradient fill starting with paint)
      if (element.tagName === "rect") {
        const fill = element.getAttribute("fill");
        if (fill && fill.startsWith("url(#paint") && fill.includes("_linear")) {
          // Check if next element is a star path
          const nextElement = allChildren[i + 1];
          if (nextElement && nextElement.tagName === "path") {
            const nextFill = nextElement.getAttribute("fill");
            if (nextFill && nextFill.startsWith("url(#paint") && nextFill.includes("_linear")) {
              levelMarkers.push({
                levelNumber: levelCounter++,
                starRect: element,
                starPath: nextElement,
                type: "star",
              });
              i++; // Skip the next element (star path)
              continue;
            }
          }
        }
      }
      
      // Check if it's a lock path (path with fill="#212660")
      if (element.tagName === "path") {
        const fill = element.getAttribute("fill");
        if (fill === "#212660") {
          // Check if next element is a lock rect (rect with pattern fill)
          const nextElement = allChildren[i + 1];
          if (nextElement && nextElement.tagName === "rect") {
            const nextFill = nextElement.getAttribute("fill");
            if (nextFill && nextFill.startsWith("url(#pattern")) {
              levelMarkers.push({
                levelNumber: levelCounter++,
                lockPath: element,
                lockRect: nextElement,
                type: "lock",
              });
              i++; // Skip the next element (lock rect)
              continue;
            }
          }
        }
      }
    }

    // Update visibility based on unlocked levels
    levelMarkers.forEach((marker) => {
      const isUnlocked = marker.levelNumber <= maxUnlockedLevel;
      
      if (marker.type === "star") {
        // Show star if unlocked, hide if locked
        if (marker.starRect) {
          (marker.starRect as SVGElement).style.display = isUnlocked ? "block" : "none";
        }
        if (marker.starPath) {
          (marker.starPath as SVGElement).style.display = isUnlocked ? "block" : "none";
        }
      } else if (marker.type === "lock") {
        // Show lock if locked, hide if unlocked
        if (marker.lockPath) {
          (marker.lockPath as SVGElement).style.display = isUnlocked ? "none" : "block";
        }
        if (marker.lockRect) {
          (marker.lockRect as SVGElement).style.display = isUnlocked ? "none" : "block";
        }
      }
    });

    // Update main path - show pink for unlocked portion
    if (mainPath) {
      // Create a copy for the unlocked portion
      const unlockedPath = mainPath.cloneNode(true) as SVGPathElement;
      unlockedPath.setAttribute("stroke", "#E451FE");
      unlockedPath.setAttribute("stroke-width", "4");
      unlockedPath.setAttribute("stroke-opacity", "1");
      unlockedPath.setAttribute("id", "unlocked-path");
      
      // Calculate path length for the unlocked portion
      const pathLength = mainPath.getTotalLength();
      const unlockedLength = (maxUnlockedLevel / totalLevels) * pathLength;
      unlockedPath.setAttribute("stroke-dasharray", `${unlockedLength} ${pathLength}`);
      unlockedPath.setAttribute("stroke-dashoffset", "0");
      
      // Add glow filter
      let defs = svgElement.querySelector("defs");
      if (!defs) {
        defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        svgElement.insertBefore(defs, svgElement.firstChild);
      }
      
      let glowFilter = defs?.querySelector("#glow");
      if (!glowFilter && defs) {
        glowFilter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
        glowFilter.setAttribute("id", "glow");
        glowFilter.setAttribute("x", "-50%");
        glowFilter.setAttribute("y", "-50%");
        glowFilter.setAttribute("width", "200%");
        glowFilter.setAttribute("height", "200%");
        
        const blur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
        blur.setAttribute("stdDeviation", "4");
        blur.setAttribute("result", "coloredBlur");
        glowFilter.appendChild(blur);
        
        const merge = document.createElementNS("http://www.w3.org/2000/svg", "feMerge");
        const mergeNode1 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
        mergeNode1.setAttribute("in", "coloredBlur");
        const mergeNode2 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
        mergeNode2.setAttribute("in", "SourceGraphic");
        merge.appendChild(mergeNode1);
        merge.appendChild(mergeNode2);
        glowFilter.appendChild(merge);
        defs.appendChild(glowFilter);
      }
      
      unlockedPath.setAttribute("filter", "url(#glow)");
      
      // Update original path
      mainPath.setAttribute("stroke", "#434B93");
      mainPath.setAttribute("stroke-opacity", "0.5");
      mainPath.setAttribute("stroke-width", "2");
      
      // Insert unlocked path after main path
      if (mainPath.parentNode) {
        mainPath.parentNode.insertBefore(unlockedPath, mainPath.nextSibling);
      }
    }

    // Set SVG size
    svgElement.setAttribute("width", width.toString());
    svgElement.setAttribute("height", height.toString());
    svgElement.setAttribute("viewBox", "0 0 846 619");

    // Render the updated SVG
    container.innerHTML = svgElement.outerHTML;

    // Add click handlers
    if (onLevelClick) {
      const renderedSvg = container.querySelector("svg");
      if (renderedSvg) {
        const allLevelElements = renderedSvg.querySelectorAll(
          "rect[fill^='url(#paint'], path[fill='#212660']"
        );
        allLevelElements.forEach((element, index) => {
          const levelNumber = index + 1;
          element.addEventListener("click", () => onLevelClick(levelNumber));
          (element as HTMLElement).style.cursor = "pointer";
        });
      }
    }
  }, [svgContent, maxUnlockedLevel, totalLevels, width, height, onLevelClick]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
}
