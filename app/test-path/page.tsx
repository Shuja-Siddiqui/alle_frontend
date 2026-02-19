"use client";

import { PathGenerator } from "../student/components/PathGenerator";

export default function TestPathPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-900 p-8">
      <div className="w-full max-w-4xl space-y-8">
        <h1
          className="text-center text-4xl font-bold text-white"
          style={{
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            textTransform: "uppercase",
          }}
        >
          Path Generator Test
        </h1>

        <div className="space-y-4">
          <div className="rounded-lg bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Default Path (900x900, 20 points)
            </h2>
            <div className="flex justify-center rounded-lg bg-white p-4">
              <PathGenerator
                width={900}
                height={900}
                minBoundaryDistance={50}
                minPathDistance={50}
                numPoints={20}
              />
            </div>
          </div>

          <div className="rounded-lg bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">
              More Points (30 points)
            </h2>
            <div className="flex justify-center rounded-lg bg-white p-4">
              <PathGenerator
                width={900}
                height={900}
                minBoundaryDistance={50}
                minPathDistance={50}
                numPoints={30}
              />
            </div>
          </div>

          <div className="rounded-lg bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Larger Boundary Distance (100px)
            </h2>
            <div className="flex justify-center rounded-lg bg-white p-4">
              <PathGenerator
                width={900}
                height={900}
                minBoundaryDistance={100}
                minPathDistance={50}
                numPoints={20}
              />
            </div>
          </div>

          <div className="rounded-lg bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Larger Path Distance (100px)
            </h2>
            <div className="flex justify-center rounded-lg bg-white p-4">
              <PathGenerator
                width={900}
                height={900}
                minBoundaryDistance={50}
                minPathDistance={100}
                numPoints={20}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-2 text-xl font-semibold text-white">
            Path Constraints:
          </h2>
          <ul className="list-inside list-disc space-y-1 text-gray-300">
            <li>Minimum 50px distance from boundaries</li>
            <li>Minimum 50px distance between path segments</li>
            <li>Turns between 30° and 90°</li>
            <li>No path crossings</li>
            <li>Smooth curves using Catmull-Rom splines</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

