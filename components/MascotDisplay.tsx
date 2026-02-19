"use client";

import { useEffect, useRef, useState } from "react";

type MascotDisplayProps = {
  headId: string; // e.g., "head1", "head2"
  hairId: string; // e.g., "hair1", "hair2"
  bodyId: string; // e.g., "body1", "body2"
  hairColor?: string;
  className?: string;
  style?: React.CSSProperties;
};

export function MascotDisplay({
  headId,
  hairId,
  bodyId,
  hairColor = "#E451FE",
  className = "",
  style,
}: MascotDisplayProps) {
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const previousPartsRef = useRef({ headId: "", hairId: "", bodyId: "", hairColor: "" });

  // Load the master SVG once
  useEffect(() => {
    fetch("/assets/icons/mascots/mascot.svg")
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
  }, []);

  // Replace mascot parts when they change
  useEffect(() => {
    if (!svgContainerRef.current || !svgContent) return;

    const svg = svgContainerRef.current.querySelector("svg");
    if (!svg) {
      // First time: insert SVG content
      svgContainerRef.current.innerHTML = svgContent;
      const newSvg = svgContainerRef.current.querySelector("svg");
      if (!newSvg) {
        console.error("MascotDisplay: SVG element not found");
        return;
      }
      newSvg.setAttribute("width", "100%");
      newSvg.setAttribute("height", "100%");
      newSvg.style.display = "block";
      
      // Store initial values
      previousPartsRef.current = { headId, hairId, bodyId, hairColor };
      console.log("MascotDisplay: Initial load complete, showing default mascot");
      return;
    }

    // Check what changed
    const headChanged = previousPartsRef.current.headId !== headId;
    const hairChanged = previousPartsRef.current.hairId !== hairId;
    const bodyChanged = previousPartsRef.current.bodyId !== bodyId;
    const colorChanged = previousPartsRef.current.hairColor !== hairColor;

    console.log("MascotDisplay: Changes detected:", { headChanged, hairChanged, bodyChanged, colorChanged });

    // Function to load and replace a part
    const replacePart = async (
      partType: "head" | "hair" | "body",
      partId: string
    ) => {
      try {
        const folderName = partType === "head" ? "heads" : partType === "hair" ? "hair" : "body";
        
        console.log(`Loading ${partType}: ${partId} from /assets/icons/mascots/${folderName}/${partId}.svg`);
        
        const response = await fetch(`/assets/icons/mascots/${folderName}/${partId}.svg`);
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

        // Special handling for hair: extract ONLY the hair group (exclude face/head)
        if (partType === "hair") {
          console.log("Processing hair replacement...");
          
          // Log all groups in the loaded hair SVG
          const allGroups = partSvg.querySelectorAll("g[id]");
          console.log("Groups in loaded hair SVG:", Array.from(allGroups).map(g => g.id));
          
          // Find the most specific hair group (usually the last one with "hair" in lowercase)
          const hairGroups = Array.from(allGroups).filter(g => 
            g.id.toLowerCase().includes('hair') &&
            !g.id.toLowerCase().includes('head') &&
            !g.id.toLowerCase().includes('face')
          );
          
          console.log("Filtered hair groups:", hairGroups.map(g => g.id));
          
          // Prefer the lowercase "hair X" group (most specific) - note: NO 'i' flag for case-sensitive
          let hairGroupInLoadedSvg = hairGroups.find(g => /^hair\s+\d+$/.test(g.id.trim()));
          
          console.log("Lowercase 'hair X' match:", hairGroupInLoadedSvg ? (hairGroupInLoadedSvg as any).id : "none");
          
          // Fallback: use the LAST hair group (usually most specific)
          if (!hairGroupInLoadedSvg && hairGroups.length > 0) {
            hairGroupInLoadedSvg = hairGroups[hairGroups.length - 1];
            console.log("Using last hair group:", (hairGroupInLoadedSvg as any).id);
          }
          
          if (!hairGroupInLoadedSvg) {
            console.error(`Hair group not found in ${partId}.svg. Available hair groups:`, hairGroups.map(g => g.id));
            return;
          }

          const hairGroupInMaster = svg.querySelector('[id*="hair" i], [id*="Hair" i]');
          if (!hairGroupInMaster) {
            console.error(`Hair group not found in master SVG`);
            return;
          }

          console.log(`✅ Using hair group: ${(hairGroupInLoadedSvg as any).id}`);
          console.log(`Replacing in master SVG group: ${hairGroupInMaster.id}`);

          // Get the original hair position before replacing
          const originalBBox = (hairGroupInMaster as SVGGraphicsElement).getBBox();
          console.log(`Original hair position:`, originalBBox);

          // Clear and replace content
          hairGroupInMaster.innerHTML = "";
          Array.from(hairGroupInLoadedSvg.children).forEach((child) => {
            hairGroupInMaster.appendChild(child.cloneNode(true));
          });

          // Get the new hair's bounding box
          const newBBox = (hairGroupInMaster as SVGGraphicsElement).getBBox();
          console.log(`New hair position before transform:`, newBBox);

          // Calculate transform to position the new hair where the old one was
          const translateX = originalBBox.x - newBBox.x;
          const translateY = originalBBox.y - newBBox.y;
          const scaleX = originalBBox.width / newBBox.width;
          const scaleY = originalBBox.height / newBBox.height;
          const scale = Math.min(scaleX, scaleY);

          console.log(`Hair transform: translate(${translateX}, ${translateY}) scale(${scale})`);

          // Create wrapper group with transform
          const wrapperGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
          wrapperGroup.setAttribute("transform", `translate(${translateX}, ${translateY}) scale(${scale})`);

          // Move all children into wrapper
          while (hairGroupInMaster.firstChild) {
            wrapperGroup.appendChild(hairGroupInMaster.firstChild);
          }

          // Add wrapper back
          hairGroupInMaster.appendChild(wrapperGroup);

          console.log(`✅ Replaced hair with ${partId} (positioned at ${translateX}, ${translateY})`);

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

        // For head and body: replace the group's content with proper positioning
        let targetGroup: Element | null = null;
        
        if (partType === "head") {
          targetGroup = svg.querySelector('[id^="Head"], [id*="head" i]');
        } else if (partType === "body") {
          targetGroup = svg.querySelector('[id^="Body"], [id*="body" i]');
        }

        if (!targetGroup) {
          console.error(`Target group for ${partType} not found in master SVG`);
          return;
        }

        // Get the bounding box of the original content to preserve positioning
        const originalBBox = (targetGroup as SVGGraphicsElement).getBBox();
        console.log(`Original ${partType} position:`, originalBBox);

        // Get viewBoxes
        const masterViewBox = svg.getAttribute("viewBox");
        const partViewBox = partSvg.getAttribute("viewBox");
        
        console.log(`Master viewBox: ${masterViewBox}, Part viewBox: ${partViewBox}`);

        // Find the content in the loaded SVG
        const loadedGroup = partSvg.querySelector('[id*="head" i], [id*="body" i], g');
        
        // Clear target and copy content
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

        // Get the new content's bounding box
        const newBBox = (targetGroup as SVGGraphicsElement).getBBox();
        console.log(`New ${partType} position before transform:`, newBBox);

        // Calculate the transform to position the new head where the old one was
        // The head SVG is at (0,0) in its own coordinate system
        // We need to move it to match the original head's position
        const translateX = originalBBox.x - newBBox.x;
        const translateY = originalBBox.y - newBBox.y;
        
        // Also might need to scale if sizes don't match
        const scaleX = originalBBox.width / newBBox.width;
        const scaleY = originalBBox.height / newBBox.height;
        
        console.log(`Transform needed: translate(${translateX}, ${translateY}) scale(${scaleX}, ${scaleY})`);
        
        // Apply transform to position correctly
        // Use the average scale to maintain aspect ratio
        const scale = Math.min(scaleX, scaleY);
        
        // Create a wrapper group with the transform
        const wrapperGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        wrapperGroup.setAttribute("transform", `translate(${translateX}, ${translateY}) scale(${scale})`);
        
        // Move all children into the wrapper
        while (targetGroup.firstChild) {
          wrapperGroup.appendChild(targetGroup.firstChild);
        }
        
        // Add wrapper back to target
        targetGroup.appendChild(wrapperGroup);

        console.log(`✅ Replaced ${partType} with ${partId} (positioned at ${translateX}, ${translateY})`);
      } catch (error) {
        console.error(`Error replacing ${partType}:`, error);
      }
    };

    // Only replace what changed
    if (headChanged) replacePart("head", headId);
    if (hairChanged) replacePart("hair", hairId);
    if (bodyChanged) replacePart("body", bodyId);
    
    // Apply color change without reloading
    if (colorChanged && !hairChanged) {
      const hairGroupInMaster = svg.querySelector('[id*="hair" i], [id*="Hair" i]');
      if (hairGroupInMaster) {
        (hairGroupInMaster as SVGElement).style.filter = `hue-rotate(${getHueRotation(
          hairColor
        )}deg) saturate(${getSaturation(hairColor)}%) brightness(${getBrightness(
          hairColor
        )}%)`;
      }
    }

    // Update previous values
    previousPartsRef.current = { headId, hairId, bodyId, hairColor };
  }, [svgContent, headId, hairId, bodyId, hairColor]);

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

