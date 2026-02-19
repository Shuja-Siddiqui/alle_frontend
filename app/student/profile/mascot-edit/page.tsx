"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MascotCreation } from "@/components/MascotCreation";

export default function MascotEditPage() {
  const router = useRouter();
  
  // TODO: Fetch current mascot parts from API
  const [mascotParts, setMascotParts] = useState<{
    face: string;
    hair: string;
    body: string;
    hairColor?: string;
  }>({
    face: "head1",
    hair: "hair1",
    body: "body1",
    hairColor: "#E451FE",
  });

  const handleMascotSave = (parts: { face: string; hair: string; body: string; hairColor?: string }) => {
    // TODO: Wire up to API to save mascot parts
    console.log("Saving mascot:", parts);
    setMascotParts(parts);
    // Navigate back to profile page after saving
    router.push("/student/profile");
  };

  const handleMascotBack = () => {
    // Navigate back to profile page
    router.push("/student/profile");
  };

  return (
    <div
      className="relative flex flex-col items-center font-sans"
      style={{
        width: "1440px",
        height: "calc(100vh - 40px - 60.864px)",
        padding: "44px",
      }}
    >
      <div
        className="w-full h-full flex flex-col"
        style={{
          background: "rgba(0, 0, 32, 0.80)",
        }}
      >
        <MascotCreation
          initialParts={mascotParts}
          onPartSelect={setMascotParts}
          onSave={handleMascotSave}
          onBack={handleMascotBack}
        />
      </div>
    </div>
  );
}

