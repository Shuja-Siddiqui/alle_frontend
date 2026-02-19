"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type EduPortalProps = {
  text?: string;
  /** Optional custom onClick handler. If not provided, navigates to home page */
  onClick?: () => void;
};

export function EduPortal({ text = "EduPortal", onClick }: EduPortalProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Navigate to student home page by default
      router.push("/student/home");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center gap-[16px] cursor-pointer bg-transparent border-none p-0"
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: "pointer",
      }}
    >
      {/* Logo - 45x45px */}
      <div className="relative shrink-0 size-[45px]" data-node-id="2133:242">
        <Image
          src="/assets/icons/others/circle_badge.png"
          alt="Edu portal badge"
          width={45}
          height={45}
          className="block max-w-none size-full"
        />
      </div>
      {/* Text - 28px, letter-spacing -0.56px */}
      <p
        className="font-bold font-medium leading-[0] relative shrink-0 text-white tracking-[-0.56px]"
        style={{
          fontSize: "28px",
          fontFamily: "var(--font-orbitron), system-ui, sans-serif",
        }}
        data-node-id="2133:244"
      >
        <span className="leading-[normal] text-[#e851ff]">Edu</span>
        <span className="leading-[normal]">Portal</span>
      </p>
    </button>
  );
}

