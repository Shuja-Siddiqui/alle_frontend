"use client";

import { useMemo } from "react";

type PathGeneratorProps = {
  width?: number;
  height?: number;
  minBoundaryDistance?: number;
  minPathDistance?: number;
  numPoints?: number;
  className?: string;
};

/**
 * Generates a path within a bounded area with constraints:
 * - Path stays at least minBoundaryDistance from boundaries
 * - Path segments maintain at least minPathDistance from each other
 * - Turns are between 30 and 90 degrees
 */
export function PathGenerator({
  width = 900,
  height = 900,
  minBoundaryDistance = 50,
  minPathDistance = 50,
  numPoints = 20,
  className,
}: PathGeneratorProps) {
  const pathData = useMemo(() => {
    return generatePath(
      width,
      height,
      minBoundaryDistance,
      minPathDistance,
      numPoints
    );
  }, [width, height, minBoundaryDistance, minPathDistance, numPoints]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ border: "1px solid #ccc" }}
    >
      <path
        d={pathData}
        fill="none"
        stroke="#22528C"
        strokeWidth="2"
        strokeOpacity="0.7"
      />
    </svg>
  );
}

/**
 * Generates a path string that respects all constraints
 */
function generatePath(
  width: number,
  height: number,
  minBoundaryDistance: number,
  minPathDistance: number,
  numPoints: number
): string {
  const points: Array<{ x: number; y: number }> = [];
  const maxAttempts = 1000;
  
  // Valid area (excluding boundary margin)
  const minX = minBoundaryDistance;
  const maxX = width - minBoundaryDistance;
  const minY = minBoundaryDistance;
  const maxY = height - minBoundaryDistance;

  // Generate first point randomly within valid area
  let currentX = minX + Math.random() * (maxX - minX);
  let currentY = minY + Math.random() * (maxY - minY);
  let currentAngle = Math.random() * Math.PI * 2; // Random initial direction
  
  points.push({ x: currentX, y: currentY });

  // Generate subsequent points
  for (let i = 1; i < numPoints; i++) {
    let nextPoint: { x: number; y: number } | null = null;
    let attempts = 0;
    
    while (!nextPoint && attempts < maxAttempts) {
      attempts++;
      
      // Generate a turn angle between 30 and 90 degrees (or -30 to -90)
      const turnDirection = Math.random() > 0.5 ? 1 : -1;
      const turnAngle = (30 + Math.random() * 60) * (Math.PI / 180); // 30-90 degrees in radians
      const newAngle = currentAngle + turnDirection * turnAngle;
      
      // Generate a distance (not too short, not too long)
      const distance = minPathDistance + Math.random() * (minPathDistance * 2);
      
      // Calculate next point
      const nextX = currentX + Math.cos(newAngle) * distance;
      const nextY = currentY + Math.sin(newAngle) * distance;
      
      // Check if point is within bounds
      if (
        nextX < minX ||
        nextX > maxX ||
        nextY < minY ||
        nextY > maxY
      ) {
        continue; // Try again
      }
      
      // Check if point is far enough from all previous points
      let tooClose = false;
      for (const point of points) {
        const dist = Math.sqrt(
          Math.pow(nextX - point.x, 2) + Math.pow(nextY - point.y, 2)
        );
        if (dist < minPathDistance) {
          tooClose = true;
          break;
        }
      }
      
      if (tooClose) {
        continue; // Try again
      }
      
      // Check if the path segment would cross any existing segments
      if (i > 1 && wouldCrossPath(points, currentX, currentY, nextX, nextY, minPathDistance)) {
        continue; // Try again
      }
      
      // Point is valid
      nextPoint = { x: nextX, y: nextY };
      currentX = nextX;
      currentY = nextY;
      currentAngle = newAngle;
    }
    
    if (nextPoint) {
      points.push(nextPoint);
    } else {
      // If we can't find a valid point, try to continue in a safe direction
      // towards the center of the valid area
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      const angleToCenter = Math.atan2(centerY - currentY, centerX - currentX);
      const safeDistance = minPathDistance;
      
      const nextX = currentX + Math.cos(angleToCenter) * safeDistance;
      const nextY = currentY + Math.sin(angleToCenter) * safeDistance;
      
      if (
        nextX >= minX &&
        nextX <= maxX &&
        nextY >= minY &&
        nextY <= maxY
      ) {
        points.push({ x: nextX, y: nextY });
        currentX = nextX;
        currentY = nextY;
        currentAngle = angleToCenter;
      } else {
        // If even that fails, break to avoid infinite loop
        break;
      }
    }
  }

  // Generate path string using smooth curves (Catmull-Rom spline)
  if (points.length < 2) {
    return "";
  }

  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  // Use Catmull-Rom spline for smooth curves
  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : points[i + 1];
    
    // Catmull-Rom to Cubic Bezier conversion
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  
  return path;
}

/**
 * Checks if a line segment would cross any existing path segments
 */
function wouldCrossPath(
  existingPoints: Array<{ x: number; y: number }>,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  minDistance: number
): boolean {
  for (let i = 0; i < existingPoints.length - 1; i++) {
    const p1 = existingPoints[i];
    const p2 = existingPoints[i + 1];
    
    // Check if segments intersect
    if (doSegmentsIntersect(x1, y1, x2, y2, p1.x, p1.y, p2.x, p2.y)) {
      return true;
    }
    
    // Also check minimum distance between segments
    const dist = distanceBetweenSegments(
      x1, y1, x2, y2,
      p1.x, p1.y, p2.x, p2.y
    );
    
    if (dist < minDistance) {
      return true;
    }
  }
  
  return false;
}

/**
 * Checks if two line segments intersect
 */
function doSegmentsIntersect(
  x1: number, y1: number, x2: number, y2: number,
  x3: number, y3: number, x4: number, y4: number
): boolean {
  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  
  if (Math.abs(denom) < 1e-10) {
    return false; // Parallel lines
  }
  
  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
  
  // Check if intersection is within both segments
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

/**
 * Calculates the minimum distance between two line segments
 */
function distanceBetweenSegments(
  x1: number, y1: number, x2: number, y2: number,
  x3: number, y3: number, x4: number, y4: number
): number {
  // Check all combinations of endpoints and closest points on segments
  const distances = [
    pointToSegmentDistance(x1, y1, x3, y3, x4, y4),
    pointToSegmentDistance(x2, y2, x3, y3, x4, y4),
    pointToSegmentDistance(x3, y3, x1, y1, x2, y2),
    pointToSegmentDistance(x4, y4, x1, y1, x2, y2),
  ];
  
  return Math.min(...distances);
}

/**
 * Calculates distance from a point to a line segment
 */
function pointToSegmentDistance(
  px: number, py: number,
  x1: number, y1: number,
  x2: number, y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;
  
  if (lengthSquared === 0) {
    return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
  }
  
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSquared));
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  
  return Math.sqrt((px - projX) ** 2 + (py - projY) ** 2);
}

