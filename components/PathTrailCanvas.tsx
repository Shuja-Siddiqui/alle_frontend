"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Point = { x: number; y: number };

type PathTrailCanvasProps = {
  width?: number;
  height?: number;
  className?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function dist(a: Point, b: Point) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Check if two line segments intersect
function segmentsIntersect(
  p1: Point,
  p2: Point,
  p3: Point,
  p4: Point
): boolean {
  // Helper function to calculate cross product
  const crossProduct = (o: Point, a: Point, b: Point): number => {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  };

  // Check if point p3 is on the same side of line p1-p2 as p4
  const d1 = crossProduct(p1, p2, p3);
  const d2 = crossProduct(p1, p2, p4);
  const d3 = crossProduct(p3, p4, p1);
  const d4 = crossProduct(p3, p4, p2);

  // Check if segments intersect (not including endpoints)
  if (d1 * d2 < 0 && d3 * d4 < 0) {
    return true;
  }

  return false;
}

// Calculate minimum distance between two line segments
function minDistanceBetweenSegments(
  p1: Point,
  p2: Point,
  p3: Point,
  p4: Point
): number {
  // Distance from point to line segment
  const pointToSegmentDist = (p: Point, s1: Point, s2: Point): number => {
    const A = p.x - s1.x;
    const B = p.y - s1.y;
    const C = s2.x - s1.x;
    const D = s2.y - s1.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;

    let xx: number, yy: number;

    if (param < 0) {
      xx = s1.x;
      yy = s1.y;
    } else if (param > 1) {
      xx = s2.x;
      yy = s2.y;
    } else {
      xx = s1.x + param * C;
      yy = s1.y + param * D;
    }

    const dx = p.x - xx;
    const dy = p.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Check distances from endpoints to the other segment
  const d1 = pointToSegmentDist(p1, p3, p4);
  const d2 = pointToSegmentDist(p2, p3, p4);
  const d3 = pointToSegmentDist(p3, p1, p2);
  const d4 = pointToSegmentDist(p4, p1, p2);

  return Math.min(d1, d2, d3, d4);
}

function getMousePos(canvas: HTMLCanvasElement, e: MouseEvent) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);
  return { x, y };
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  fill: string,
  stroke: string
) {
  const spikes = 5;
  const outerRadius = radius;
  const innerRadius = radius * 0.45;

  let rot = (Math.PI / 2) * 3;
  let cx = x;
  let cy = y;
  let step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
    rot += step;
  }
  ctx.closePath();

  ctx.fillStyle = fill;
  ctx.fill();

  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.stroke();
}

export function PathTrailCanvas({
  width = 900,
  height = 600,
  className,
}: PathTrailCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [hover, setHover] = useState<Point | null>(null);
  const [isDraggingIdx, setIsDraggingIdx] = useState<number | null>(null);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [showGrid, setShowGrid] = useState(true);
  const [minPointDistance, setMinPointDistance] = useState(25);
  const [minSegmentDistance, setMinSegmentDistance] = useState(30);
  const [numPointsToGenerate, setNumPointsToGenerate] = useState(30);

  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

  const exportJson = useMemo(() => JSON.stringify(points, null, 2), [points]);

  const nearestPointIndex = (p: Point) => {
    let bestIdx = -1;
    let best = Number.POSITIVE_INFINITY;
    for (let i = 0; i < points.length; i++) {
      const d = dist(p, points[i]);
      if (d < best) {
        best = d;
        bestIdx = i;
      }
    }
    return best <= 16 * dpr ? bestIdx : -1; // hit radius
  };

  const quantize = (p: Point) => {
    if (!snapToGrid) return p;
    const gs = Math.max(2, gridSize) * dpr;
    return {
      x: Math.round(p.x / gs) * gs,
      y: Math.round(p.y / gs) * gs,
    };
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = "#0b0f37";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    if (showGrid) {
      const gs = Math.max(2, gridSize) * dpr;
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = "#434B93";
      ctx.lineWidth = 1;
      for (let x = 0; x <= canvas.width; x += gs) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += gs) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Path lines - draw as smooth curves that pass through all points
    if (points.length >= 2) {
      ctx.save();
      ctx.strokeStyle = "#FF00CA";
      ctx.lineWidth = 4;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      
      if (points.length === 2) {
        // Simple line for 2 points
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
      } else {
        // Use Catmull-Rom spline to ensure curve passes through all points
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 0; i < points.length - 1; i++) {
          const p0 = i > 0 ? points[i - 1] : points[i];
          const p1 = points[i];
          const p2 = points[i + 1];
          const p3 = i < points.length - 2 ? points[i + 2] : points[i + 1];
          
          // Catmull-Rom spline control points
          // The curve will pass through p1 and p2
          const cp1x = p1.x + (p2.x - p0.x) / 6;
          const cp1y = p1.y + (p2.y - p0.y) / 6;
          const cp2x = p2.x - (p3.x - p1.x) / 6;
          const cp2y = p2.y - (p3.y - p1.y) / 6;
          
          // Use cubic bezier to draw the segment
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        }
      }
      
      ctx.stroke();
      ctx.restore();
    }

    // Hover preview line
    if (hover && points.length >= 1) {
      const last = points[points.length - 1];
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.strokeStyle = "#E451FE";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(hover.x, hover.y);
      ctx.stroke();
      ctx.restore();
    }

    // Points + stars
    for (let i = 0; i < points.length; i++) {
      const p = points[i];

      // point dot
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? "#17E0FE" : "#FFFFFF";
      ctx.globalAlpha = 0.95;
      ctx.fill();
      ctx.restore();

      // star marker on every point after the first
      if (i >= 1) {
        drawStar(ctx, p.x, p.y, 12, "#FF00CA", "#FFFFFF");
      }

      // label A/B/C...
      const label = i < 26 ? String.fromCharCode(65 + i) : `${i + 1}`;
      ctx.save();
      ctx.font = `${12 * dpr}px ui-sans-serif, system-ui, -apple-system, Segoe UI`;
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillText(label, p.x + 10, p.y - 10);
      ctx.restore();
    }
  };

  // Setup canvas size and redraw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    redraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, dpr]);

  useEffect(() => {
    redraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, hover, snapToGrid, gridSize, showGrid]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMove = (e: MouseEvent) => {
      const raw = getMousePos(canvas, e);
      const p = quantize(raw);

      if (isDraggingIdx !== null) {
        setPoints((prev) => {
          const next = [...prev];
          next[isDraggingIdx] = {
            x: clamp(p.x, 0, canvas.width),
            y: clamp(p.y, 0, canvas.height),
          };
          return next;
        });
        return;
      }

      setHover({
        x: clamp(p.x, 0, canvas.width),
        y: clamp(p.y, 0, canvas.height),
      });
    };

    const onLeave = () => setHover(null);

    const onDown = (e: MouseEvent) => {
      const raw = getMousePos(canvas, e);
      const p = quantize(raw);
      const idx = nearestPointIndex(p);
      if (idx !== -1) {
        setIsDraggingIdx(idx);
      }
    };

    const onUp = () => setIsDraggingIdx(null);

    const onClick = (e: MouseEvent) => {
      // If dragging, don't add a new point
      if (isDraggingIdx !== null) return;

      const raw = getMousePos(canvas, e);
      const p = quantize(raw);

      setPoints((prev) => {
        if (prev.length > 0) {
          const last = prev[prev.length - 1];
          if (dist(last, p) < Math.max(2, minPointDistance) * dpr) return prev;
        }
        return [
          ...prev,
          {
            x: clamp(p.x, 0, canvas.width),
            y: clamp(p.y, 0, canvas.height),
          },
        ];
      });
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    canvas.addEventListener("click", onClick);

    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("click", onClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDraggingIdx, snapToGrid, gridSize, points.length, minPointDistance]);

  const handleUndo = () => setPoints((p) => p.slice(0, -1));
  const handleClear = () => setPoints([]);

  // Helper function to validate a candidate point
  const isValidPoint = (
    candidate: Point,
    fromPoint: Point,
    existingPoints: Point[],
    existingSegments: Array<{ start: Point; end: Point }>,
    minDist: number,
    minSegDist: number,
    margin: number,
    canvasWidth: number,
    canvasHeight: number
  ): boolean => {
    // Check bounds
    if (
      candidate.x < margin ||
      candidate.x > canvasWidth - margin ||
      candidate.y < margin ||
      candidate.y > canvasHeight - margin
    ) {
      return false;
    }

    // Check minimum distance from all previous points
    for (let j = 0; j < existingPoints.length; j++) {
      if (dist(candidate, existingPoints[j]) < minDist) {
        return false;
      }
    }

    // Check if the new segment would intersect or be too close to existing segments
    if (existingSegments.length > 0) {
      const newSegmentStart = fromPoint;
      const newSegmentEnd = candidate;

      for (const segment of existingSegments) {
        // Skip if segments share an endpoint (adjacent segments)
        if (
          (segment.start.x === newSegmentStart.x && segment.start.y === newSegmentStart.y) ||
          (segment.end.x === newSegmentStart.x && segment.end.y === newSegmentStart.y) ||
          (segment.start.x === newSegmentEnd.x && segment.start.y === newSegmentEnd.y) ||
          (segment.end.x === newSegmentEnd.x && segment.end.y === newSegmentEnd.y)
        ) {
          continue;
        }

        // Check for intersection
        if (segmentsIntersect(newSegmentStart, newSegmentEnd, segment.start, segment.end)) {
          return false;
        }

        // Check minimum distance between segments
        const segmentDist = minDistanceBetweenSegments(
          newSegmentStart,
          newSegmentEnd,
          segment.start,
          segment.end
        );
        if (segmentDist < minSegDist) {
          return false;
        }
      }
    }

    return true;
  };

  const generateRandomPath = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const margin = 50 * dpr;
    const minDist = Math.max(40, minPointDistance) * dpr;
    const maxDist = 150 * dpr;
    const minSegDist = Math.max(30, minSegmentDistance) * dpr;
    const minAngleChange = Math.PI / 6; // 30 degrees minimum change
    const maxAngleChange = Math.PI / 2; // 90 degrees maximum change

    const generated: Point[] = [];
    
    // Start at a random point near the center-left
    const startX = margin + Math.random() * (canvas.width * 0.2);
    const startY = margin + Math.random() * (canvas.height - 2 * margin);
    generated.push({ x: startX, y: startY });

    // Initial direction (random angle)
    let currentAngle = Math.random() * Math.PI * 2;

    for (let i = 1; i < numPointsToGenerate; i++) {
      let nextPoint: Point | null = null;
      const lastPoint = generated[generated.length - 1];
      
      // Build existing segments array
      const existingSegments: Array<{ start: Point; end: Point }> = [];
      for (let j = 0; j < generated.length - 1; j++) {
        existingSegments.push({ start: generated[j], end: generated[j + 1] });
      }

      // Strategy 1: Try systematic angle exploration (360 degrees in steps)
      if (!nextPoint) {
        const angleSteps = 36; // Try 36 different angles (10 degrees each)
        const distanceSteps = 5; // Try 5 different distances
        
        for (let angleStep = 0; angleStep < angleSteps && !nextPoint; angleStep++) {
          // Try angles around current direction, plus random exploration
          const baseAngle = currentAngle + (angleStep / angleSteps) * Math.PI * 2;
          const angleVariation = (Math.random() - 0.5) * (maxAngleChange - minAngleChange);
          const testAngle = baseAngle + angleVariation;
          
          for (let distStep = 0; distStep < distanceSteps && !nextPoint; distStep++) {
            const distance = minDist + (distStep / (distanceSteps - 1)) * (maxDist - minDist);
            
            const candidate: Point = {
              x: lastPoint.x + Math.cos(testAngle) * distance,
              y: lastPoint.y + Math.sin(testAngle) * distance,
            };

            if (isValidPoint(
              candidate,
              lastPoint,
              generated,
              existingSegments,
              minDist,
              minSegDist,
              margin,
              canvas.width,
              canvas.height
            )) {
              nextPoint = candidate;
              currentAngle = testAngle;
            }
          }
        }
      }

      // Strategy 2: Grid-based space exploration - look for gaps
      if (!nextPoint) {
        const gridSize = Math.max(minDist * 2, 60 * dpr);
        const cols = Math.floor((canvas.width - 2 * margin) / gridSize);
        const rows = Math.floor((canvas.height - 2 * margin) / gridSize);
        
        // Shuffle grid positions for random exploration
        const gridPositions: Point[] = [];
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            gridPositions.push({
              x: margin + col * gridSize + gridSize / 2,
              y: margin + row * gridSize + gridSize / 2,
            });
          }
        }
        
        // Shuffle array
        for (let k = gridPositions.length - 1; k > 0; k--) {
          const j = Math.floor(Math.random() * (k + 1));
          [gridPositions[k], gridPositions[j]] = [gridPositions[j], gridPositions[k]];
        }
        
        // Try grid positions
        for (const gridCandidate of gridPositions) {
          if (isValidPoint(
            gridCandidate,
            lastPoint,
            generated,
            existingSegments,
            minDist,
            minSegDist,
            margin,
            canvas.width,
            canvas.height
          )) {
            nextPoint = gridCandidate;
            currentAngle = Math.atan2(
              nextPoint.y - lastPoint.y,
              nextPoint.x - lastPoint.x
            );
            break;
          }
        }
      }

      // Strategy 3: Random exploration with many attempts (from last point)
      if (!nextPoint) {
        for (let attempt = 0; attempt < 300 && !nextPoint; attempt++) {
          const randomAngle = Math.random() * Math.PI * 2;
          // Allow longer distances to reach empty areas
          const randomDistance = minDist + Math.random() * (maxDist * 2 - minDist);
          
          const candidate: Point = {
            x: lastPoint.x + Math.cos(randomAngle) * randomDistance,
            y: lastPoint.y + Math.sin(randomAngle) * randomDistance,
          };

          if (isValidPoint(
            candidate,
            lastPoint,
            generated,
            existingSegments,
            minDist,
            minSegDist,
            margin,
            canvas.width,
            canvas.height
          )) {
            nextPoint = candidate;
            currentAngle = randomAngle;
          }
        }
      }

      // Strategy 4: Find largest empty area ANYWHERE on canvas (not just near last point)
      if (!nextPoint) {
        // Sample many random points across the ENTIRE canvas
        let bestCandidate: Point | null = null;
        let bestScore = -1;
        
        for (let attempt = 0; attempt < 500; attempt++) {
          const candidate: Point = {
            x: margin + Math.random() * (canvas.width - 2 * margin),
            y: margin + Math.random() * (canvas.height - 2 * margin),
          };

          // Find minimum distance to any existing point
          let minDistToExisting = Infinity;
          for (const existing of generated) {
            const d = dist(candidate, existing);
            if (d < minDistToExisting) {
              minDistToExisting = d;
            }
          }

          // Score based on distance from existing points (prefer far away)
          // Also check if it's valid
          if (minDistToExisting >= minDist) {
            if (isValidPoint(
              candidate,
              lastPoint,
              generated,
              existingSegments,
              minDist,
              minSegDist,
              margin,
              canvas.width,
              canvas.height
            )) {
              // Score = distance to nearest point (higher is better)
              if (minDistToExisting > bestScore) {
                bestCandidate = candidate;
                bestScore = minDistToExisting;
              }
            }
          }
        }
        
        if (bestCandidate) {
          nextPoint = bestCandidate;
          currentAngle = Math.atan2(
            nextPoint.y - lastPoint.y,
            nextPoint.x - lastPoint.x
          );
        }
      }

      // Strategy 5: Systematic full-canvas exploration (when really stuck)
      if (!nextPoint) {
        // Divide canvas into a fine grid and check every cell
        const fineGridSize = Math.max(minDist * 1.5, 50 * dpr);
        const cols = Math.floor((canvas.width - 2 * margin) / fineGridSize);
        const rows = Math.floor((canvas.height - 2 * margin) / fineGridSize);
        
        // Create all grid positions
        const allGridPositions: Point[] = [];
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            allGridPositions.push({
              x: margin + col * fineGridSize + fineGridSize / 2,
              y: margin + row * fineGridSize + fineGridSize / 2,
            });
          }
        }
        
        // Sort by distance from last point (try closer first, but also try far)
        allGridPositions.sort((a, b) => {
          const distA = dist(a, lastPoint);
          const distB = dist(b, lastPoint);
          // Mix: sometimes prefer close, sometimes prefer far
          if (Math.random() > 0.5) {
            return distA - distB;
          } else {
            return distB - distA;
          }
        });
        
        // Try all grid positions
        for (const gridCandidate of allGridPositions) {
          if (isValidPoint(
            gridCandidate,
            lastPoint,
            generated,
            existingSegments,
            minDist,
            minSegDist,
            margin,
            canvas.width,
            canvas.height
          )) {
            nextPoint = gridCandidate;
            currentAngle = Math.atan2(
              nextPoint.y - lastPoint.y,
              nextPoint.x - lastPoint.x
            );
            break;
          }
        }
      }

      // Strategy 6: Last resort - relax constraints slightly and try again
      if (!nextPoint) {
        // Temporarily reduce minimum distances by 20% to find ANY valid point
        const relaxedMinDist = minDist * 0.8;
        const relaxedMinSegDist = minSegDist * 0.8;
        
        for (let attempt = 0; attempt < 400; attempt++) {
          const candidate: Point = {
            x: margin + Math.random() * (canvas.width - 2 * margin),
            y: margin + Math.random() * (canvas.height - 2 * margin),
          };

          // Use relaxed validation
          let valid = true;
          
          // Check bounds
          if (
            candidate.x < margin ||
            candidate.x > canvas.width - margin ||
            candidate.y < margin ||
            candidate.y > canvas.height - margin
          ) {
            valid = false;
          }

          // Check relaxed minimum distance from all previous points
          if (valid) {
            for (let j = 0; j < generated.length; j++) {
              if (dist(candidate, generated[j]) < relaxedMinDist) {
                valid = false;
                break;
              }
            }
          }

          // Check relaxed segment constraints
          if (valid && existingSegments.length > 0) {
            const newSegmentStart = lastPoint;
            const newSegmentEnd = candidate;

            for (const segment of existingSegments) {
              if (
                (segment.start.x === newSegmentStart.x && segment.start.y === newSegmentStart.y) ||
                (segment.end.x === newSegmentStart.x && segment.end.y === newSegmentStart.y) ||
                (segment.start.x === newSegmentEnd.x && segment.start.y === newSegmentEnd.y) ||
                (segment.end.x === newSegmentEnd.x && segment.end.y === newSegmentEnd.y)
              ) {
                continue;
              }

              if (segmentsIntersect(newSegmentStart, newSegmentEnd, segment.start, segment.end)) {
                valid = false;
                break;
              }

              const segmentDist = minDistanceBetweenSegments(
                newSegmentStart,
                newSegmentEnd,
                segment.start,
                segment.end
              );
              if (segmentDist < relaxedMinSegDist) {
                valid = false;
                break;
              }
            }
          }

          if (valid) {
            nextPoint = candidate;
            currentAngle = Math.atan2(
              nextPoint.y - lastPoint.y,
              nextPoint.x - lastPoint.x
            );
            break;
          }
        }
      }

      // If still no point found, we've exhausted all strategies
      if (!nextPoint) {
        console.warn(`Could not generate point ${i + 1} after exhaustive search. Stopping at ${generated.length} points.`);
        break;
      }

      generated.push(nextPoint);
    }

    setPoints(generated);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportJson);
      // lightweight feedback without adding more UI dependencies
      alert("Copied points JSON to clipboard");
    } catch {
      alert("Could not copy. You can select the JSON and copy manually.");
    }
  };

  const handleDownloadJson = () => {
    const blob = new Blob([exportJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "path-points.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "path-canvas.png";
    a.click();
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3 pb-4">
        <button
          type="button"
          onClick={handleUndo}
          disabled={points.length === 0}
          className="rounded-full border border-[#434B93] bg-[#0B0F37] px-4 py-2 text-white disabled:opacity-40"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={handleClear}
          disabled={points.length === 0}
          className="rounded-full border border-[#434B93] bg-[#0B0F37] px-4 py-2 text-white disabled:opacity-40"
        >
          Clear
        </button>
        <div className="flex items-center gap-2 rounded-full border border-[#E451FE] bg-[#0B0F37] px-4 py-2">
          <label className="text-white">
            Points:
            <input
              type="number"
              min={2}
              max={200}
              value={numPointsToGenerate}
              onChange={(e) => setNumPointsToGenerate(Number(e.target.value) || 30)}
              className="ml-2 w-20 rounded-md border border-[#434B93] bg-[#060826] px-2 py-1 text-white"
            />
          </label>
          <button
            type="button"
            onClick={generateRandomPath}
            className="rounded-md border border-[#E451FE] bg-[#E451FE] px-4 py-1 text-white hover:bg-[#FF00CA]"
          >
            Generate
          </button>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-[#E451FE] bg-[#0B0F37] px-4 py-2 text-white"
        >
          Copy JSON
        </button>
        <button
          type="button"
          onClick={handleDownloadJson}
          className="rounded-full border border-[#434B93] bg-[#0B0F37] px-4 py-2 text-white"
        >
          Download JSON
        </button>
        <button
          type="button"
          onClick={handleDownloadPng}
          className="rounded-full border border-[#434B93] bg-[#0B0F37] px-4 py-2 text-white"
        >
          Download PNG
        </button>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
            />
            Grid
          </label>
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={snapToGrid}
              onChange={(e) => setSnapToGrid(e.target.checked)}
            />
            Snap
          </label>
          <label className="flex items-center gap-2 text-white">
            Grid size
            <input
              type="number"
              min={5}
              max={80}
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value || 20))}
              className="w-20 rounded-md border border-[#434B93] bg-[#0B0F37] px-2 py-1 text-white"
            />
          </label>
          <label className="flex items-center gap-2 text-white">
            Min point dist
            <input
              type="number"
              min={0}
              max={80}
              value={minPointDistance}
              onChange={(e) => setMinPointDistance(Number(e.target.value || 25))}
              className="w-20 rounded-md border border-[#434B93] bg-[#0B0F37] px-2 py-1 text-white"
            />
          </label>
          <label className="flex items-center gap-2 text-white">
            Min segment dist
            <input
              type="number"
              min={0}
              max={80}
              value={minSegmentDistance}
              onChange={(e) => setMinSegmentDistance(Number(e.target.value || 30))}
              className="w-20 rounded-md border border-[#434B93] bg-[#0B0F37] px-2 py-1 text-white"
            />
          </label>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="rounded-[18px] border border-[#434B93] shadow-[0_0_0_1px_rgba(228,81,254,0.35)]"
      />

      <div className="grid grid-cols-1 gap-3 pt-4 md:grid-cols-2">
        <div className="rounded-[18px] border border-[#434B93] bg-[#0B0F37] p-4 text-white">
          <div className="text-sm opacity-80">
            Click to add points A → B → C… Drag a point to adjust.
          </div>
          <div className="pt-2 text-sm opacity-80">
            Stars are placed on every point after the first.
          </div>
        </div>
        <div className="rounded-[18px] border border-[#434B93] bg-[#0B0F37] p-4">
          <div className="pb-2 text-sm text-white opacity-80">Points JSON</div>
          <textarea
            readOnly
            value={exportJson}
            className="h-[120px] w-full resize-none rounded-[12px] border border-[#21265D] bg-[#060826] p-3 font-mono text-xs text-white outline-none"
          />
        </div>
      </div>
    </div>
  );
}


