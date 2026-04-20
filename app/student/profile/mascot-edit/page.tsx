"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MascotCreation } from "@/components/MascotCreation";
import { ConfirmCancelDialog } from "@/components/ConfirmCancelDialog";
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

  // Draft mascot parts while editing (not persisted until user confirms)
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

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

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
    setHasUnsavedChanges(false);
  }, [user?.mascot]);

  // Persist the full mascot in a single request
  const saveMascot = async (parts: {
    head: string;
    hair: string;
    body: string;
    collar: string;
    hairColor?: string;
  }) => {
    const loadingMessage = "Saving mascot...";
    try {
      showLoader(loadingMessage);
      const mascot: Record<string, string> = {};
      mascot.face = parts.head;
      mascot.hair = parts.hair;
      mascot.body = parts.body;
      if (parts.hairColor) mascot.hairColor = parts.hairColor;
      await post("/users/profile", { mascot });
      setMascotParts((prev) => ({
        ...prev,
        head: mascot.face ?? prev.head,
        hair: mascot.hair ?? prev.hair,
        body: mascot.body ?? prev.body,
        collar: getCollarFromBody(mascot.body ?? prev.body),
        hairColor: mascot.hairColor ?? prev.hairColor,
      }));
      await refreshUser();
      showSuccess("Saved!");
      setHasUnsavedChanges(false);
    } catch (err: any) {
      const msg = err?.response?.message || err?.message || "Failed to save";
      showError(msg);
    } finally {
      hideLoader();
    }
  };

  const handleMascotBack = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      router.push("/student/profile");
    }
  };

  return (
    <div
      className="relative flex flex-col items-center font-sans"
      style={{
        paddingTop: "44px",
      }}
    >
      <div
        className="w-full h-full flex flex-col"

      >
        <MascotCreation
          initialParts={mascotParts}
          onPartSelect={(parts) => {
            setMascotParts(parts);
            setHasUnsavedChanges(true);
          }}
          onSave={saveMascot}
          onBack={handleMascotBack}
        />
      </div>
      <ConfirmCancelDialog
        open={showUnsavedDialog}
        title="Save changes?"
        confirmLabel="Save"
        cancelLabel="Discard"
        onConfirm={async () => {
          setShowUnsavedDialog(false);
          await saveMascot(mascotParts);
          router.push("/student/profile");
        }}
        onCancel={() => {
          setShowUnsavedDialog(false);
          router.push("/student/profile");
        }}
        onClose={() => setShowUnsavedDialog(false)}
      />
    </div>
  );
}

