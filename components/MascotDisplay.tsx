"use client";

import { useEffect, useRef, useState } from "react";

type MascotDisplayProps = {
  headId: string; // e.g., "head1", "head2"
  hairId: string; // e.g., "hair1", "hair2"
  bodyId: string; // e.g., "body1", "body2"
  collarId?: string; // e.g., "collar_front1", "collar_front2" (optional, used when assetsBase is set)
  hairColor?: string;
  className?: string;
  style?: React.CSSProperties;
  /** Base path for assets (e.g. "/assets/example_mascots"). When set, uses flat structure and mascot.svg from this folder. */
  assetsBase?: string;
};

export function MascotDisplay({
  headId,
  hairId,
  bodyId,
  collarId,
  hairColor = "#E451FE",
  className = "",
  style,
  assetsBase,
}: MascotDisplayProps) {
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const previousPartsRef = useRef({ headId: "", hairId: "", bodyId: "", collarId: "", hairColor: "" });

  const masterPath = assetsBase ? `${assetsBase}/mascot.svg` : "/assets/icons/mascots/mascot.svg";

  // Load the master SVG once
  useEffect(() => {
    fetch(masterPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load SVG: ${response.status}`);
        }
        return response.text();
      })
      .then((svgText) => {
        console.log("MascotDisplay: Master SVG loaded successfully");
        setSvgContent(svgText);
      })
      .catch((error) => {
        console.error("Error loading mascot SVG:", error);
      });
  }, [masterPath]);

  // Replace mascot parts when they change
  useEffect(() => {
    if (!svgContainerRef.current || !svgContent) return;

    const svg = svgContainerRef.current.querySelector("svg");
    let svgEl: SVGSVGElement | null = svg as SVGSVGElement | null;
    if (!svg) {
      // First time: insert SVG content
      svgContainerRef.current.innerHTML = svgContent;
      svgEl = svgContainerRef.current.querySelector("svg");
      if (!svgEl) {
        console.error("MascotDisplay: SVG element not found");
        return;
      }
      svgEl.setAttribute("width", "100%");
      svgEl.setAttribute("height", "100%");
      svgEl.style.display = "block";
      // Set previousPartsRef to empty so the change detection below will run replacePart for all parts on initial load
      previousPartsRef.current = { headId: "", hairId: "", bodyId: "", collarId: "", hairColor: "" };
    }

    // Check what changed
    const headChanged = previousPartsRef.current.headId !== headId;
    const hairChanged = previousPartsRef.current.hairId !== hairId;
    const bodyChanged = previousPartsRef.current.bodyId !== bodyId;
    const collarChanged = collarId != null && previousPartsRef.current.collarId !== collarId;
    const colorChanged = previousPartsRef.current.hairColor !== hairColor;

    console.log("MascotDisplay: Changes detected:", { headChanged, hairChanged, bodyChanged, collarChanged, colorChanged });

    if (!svgEl) return;

    // Function to load and replace a part
    const replacePart = async (
      partType: "head" | "hair" | "body" | "collar",
      partId: string
    ) => {
      try {
        const partPath = assetsBase
          ? `${assetsBase}/${partId}.svg`
          : `/assets/icons/mascots/${partType === "head" ? "heads" : partType === "collar" ? "collars" : partType === "hair" ? "hairs" : partType}/${partId}.svg`;
        
        console.log(`Loading ${partType}: ${partId} from ${partPath}`);
        
        const response = await fetch(partPath);
        if (!response.ok) {
          console.error(`Failed to load ${partId}.svg (${response.status})`);
          return;
        }

        const partSvgText = await response.text();
        const parser = new DOMParser();
        const partSvgDoc = parser.parseFromString(partSvgText, "image/svg+xml");
        const partSvg = partSvgDoc.querySelector("svg");
        
        if (!partSvg) {
          console.error(`Invalid SVG in ${partId}.svg`);
          return;
        }

        // Special handling for hair: extract hair group or use full SVG content if no group
        if (partType === "hair") {
          const allGroups = partSvg.querySelectorAll("g[id]");
          const hairGroups = Array.from(allGroups).filter(g => 
            g.id && g.id.toLowerCase().includes('hair') &&
            !g.id.toLowerCase().includes('head') &&
            !g.id.toLowerCase().includes('face')
          );
          let hairGroupInLoadedSvg = hairGroups.find(g => /^hair\s*\d*$/i.test(String(g.id || '').trim()));
          if (!hairGroupInLoadedSvg && hairGroups.length > 0) {
            hairGroupInLoadedSvg = hairGroups[hairGroups.length - 1];
          }
          // Fallback: mascot hair SVGs may have no groups (flat paths only) - use root svg children
          if (!hairGroupInLoadedSvg) {
            hairGroupInLoadedSvg = partSvg;
          }

          const hairGroupInMaster = svgEl.querySelector('[id*="hair" i], [id*="Hair" i]');
          if (!hairGroupInMaster) {
            console.error(`Hair group not found in master SVG`);
            return;
          }

          // Clear and replace content (same viewBox - no positioning needed)
          const sourceChildren = hairGroupInLoadedSvg === partSvg
            ? Array.from(partSvg.children)
            : Array.from(hairGroupInLoadedSvg.children);
          hairGroupInMaster.innerHTML = "";
          sourceChildren.forEach((child) => {
            hairGroupInMaster.appendChild(child.cloneNode(true));
          });

          console.log(`✅ Replaced hair with ${partId}`);

          // Apply hair color
          if (hairColor) {
            (hairGroupInMaster as SVGElement).style.filter = `hue-rotate(${getHueRotation(
              hairColor
            )}deg) saturate(${getSaturation(hairColor)}%) brightness(${getBrightness(
              hairColor
            )}%)`;
          }
          return;
        }

        // For head, body, collar: replace the group's content
        let targetGroup: Element | null = null;
        
        if (partType === "head") {
          targetGroup = svgEl.querySelector('[id^="Head"], [id*="head" i]');
        } else if (partType === "body") {
          targetGroup = svgEl.querySelector('[id^="Body"], [id*="body" i]');
        } else if (partType === "collar") {
          targetGroup = svgEl.querySelector('[id*="collar" i]');
        }

        if (!targetGroup) {
          console.error(`Target group for ${partType} not found in master SVG`);
          return;
        }

        // Find the content in the loaded SVG
        const loadedGroup = partSvg.querySelector('[id*="head" i], [id*="body" i], [id*="collar" i], g');
        
        // Clear target and copy content (same viewBox - no positioning needed)
        targetGroup.innerHTML = "";
        
        if (loadedGroup) {
          Array.from(loadedGroup.children).forEach((child) => {
            targetGroup!.appendChild(child.cloneNode(true));
          });
        } else {
          Array.from(partSvg.children).forEach((child) => {
            targetGroup!.appendChild(child.cloneNode(true));
          });
        }

        console.log(`✅ Replaced ${partType} with ${partId}`);
      } catch (error) {
        console.error(`Error replacing ${partType}:`, error);
      }
    };

    // Only replace what changed
    if (headChanged) replacePart("head", headId);
    if (hairChanged) replacePart("hair", hairId);
    if (bodyChanged) replacePart("body", bodyId);
    if (collarChanged && collarId) replacePart("collar", collarId);
    
    // Apply color change without reloading
    if (colorChanged && !hairChanged) {
      const hairGroupInMaster = svgEl.querySelector('[id*="hair" i], [id*="Hair" i]');
      if (hairGroupInMaster) {
        (hairGroupInMaster as SVGElement).style.filter = `hue-rotate(${getHueRotation(
          hairColor
        )}deg) saturate(${getSaturation(hairColor)}%) brightness(${getBrightness(
          hairColor
        )}%)`;
      }
    }

    // Update previous values
    previousPartsRef.current = { headId, hairId, bodyId, collarId: collarId ?? "", hairColor };
  }, [svgContent, headId, hairId, bodyId, collarId, hairColor, assetsBase]);

  return (
    <div
      ref={svgContainerRef}
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );
}

// Helper functions for color filtering
function getHueRotation(color: string): number {
  const colorMap: Record<string, number> = {
    "#E451FE": 0, // Magenta/Light Purple
    "#F1B708": 60, // Gold/Yellow
    "#17E0FE": 180, // Cyan/Light Blue
    "#0479FF": 240, // Bright Blue
    "#2FFF00": 120, // Bright Green/Lime
    "#FF1F00": 0, // Bright Red
    "#00B78C": 160, // Teal/Dark Cyan
    "#BB00FF": 280, // Bright Purple
    "#FF4000": 20, // Orange-Red
    "#B0B0B0": 0, // Gray
    "#CE44A2": 320, // Pink/Rose
  };
  return colorMap[color] || 0;
}

function getSaturation(color: string): number {
  // For grayscale colors, reduce saturation
  if (color === "#B0B0B0") return 0; // Gray
  return 100;
}

function getBrightness(color: string): number {
  return 100; // Default brightness
}

