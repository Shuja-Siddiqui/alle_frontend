"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MascotCreation } from "@/components/MascotCreation";
import { useAuth } from "@/contexts/AuthContext";
import { useUI } from "@/contexts/UIContext";
import { useApiPost } from "@/hooks/useApi";

function getCollarFromBody(bodyId: string): string {
  const match = bodyId.match(/body(\d+)/i);
  const num = match ? match[1] : "1";
  return `collar${num}`;
}

export default function MascotEditPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { showSuccess, showError, showLoader, hideLoader } = useUI();
  const { post } = useApiPost();

  const [mascotParts, setMascotParts] = useState<{
    head: string;
    hair: string;
    body: string;
    collar: string;
    hairColor?: string;
  }>({
    head: "head1",
    hair: "hair1",
    body: "body1",
    collar: "collar1",
    hairColor: "#E451FE",
  });

  // Load mascot from user when available
  useEffect(() => {
    if (!user?.mascot) return;
    const m = user.mascot;
    setMascotParts({
      head: m.face ?? "head1",
      hair: m.hair ?? "hair1",
      body: m.body ?? "body1",
      collar: getCollarFromBody(m.body ?? "body1"),
      hairColor: m.hairColor ?? "#E451FE",
    });
  }, [user?.mascot]);

  const handleSavePart = async (partial: Partial<{ face: string; hair: string; body: string; hairColor: string }>) => {
    const loadingMessage = partial.body
      ? "Saving clothes..."
      : partial.hair
        ? "Saving hair..."
        : partial.face
          ? "Saving head..."
          : "Saving...";
    try {
      showLoader(loadingMessage);
      const mascot: Record<string, string> = {};
      if (partial.face) mascot.face = partial.face;
      if (partial.hair) mascot.hair = partial.hair;
      if (partial.body) mascot.body = partial.body;
      if (partial.hairColor) mascot.hairColor = partial.hairColor;
      await post("/users/profile", { mascot });
      setMascotParts((prev) => ({
        ...prev,
        ...(partial.face && { head: partial.face }),
        ...(partial.hair && { hair: partial.hair }),
        ...(partial.body && { body: partial.body, collar: getCollarFromBody(partial.body) }),
        ...(partial.hairColor && { hairColor: partial.hairColor }),
      }));
      await refreshUser();
      showSuccess("Saved!");
    } catch (err: any) {
      const msg = err?.response?.message || err?.message || "Failed to save";
      showError(msg);
    } finally {
      hideLoader();
    }
  };

  const handleMascotBack = () => {
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
          onSavePart={handleSavePart}
          onBack={handleMascotBack}
        />
      </div>
    </div>
  );
}

