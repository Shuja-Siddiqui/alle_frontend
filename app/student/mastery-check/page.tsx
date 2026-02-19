"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MascotAvatar } from "../../../components/MascotAvatar";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { useMasteryCheckData } from "../hooks/useLessonData";
import Image from "next/image";

export default function MasteryCheckPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Get data from URL params
    const lessonId = searchParams.get("lessonId") || "lesson1";
    const missionSequence = parseInt(searchParams.get("missionSequence") || "1", 10);
    
    // Fetch mastery check data
    const masteryData = useMasteryCheckData(lessonId, missionSequence);
    
    const currentScore = masteryData?.currentScore || 6;
    const totalScore = masteryData?.totalScore || 10;
    const starsEarned = masteryData?.starsEarned || 3;

    return (
        <div
            className="relative flex flex-col items-center justify-center font-sans"
            style={{
                width: "1440px",
                height: "calc(100vh - 40px - 60.864px)",
                padding: "0 32px 32px 32px", // No top padding, 32px on other sides
            }}
        >
            {/* Center Content */}
            <div className="flex flex-col items-center justify-center gap-8">
                {/* 5 Stars - Show earned stars */}
                <div className="flex items-center gap-4 shrink-0">
                    {Array.from({ length: 5 }).map((_, index) => {
                        const isEarned = index < starsEarned;
                        return (
                            <div
                                key={index}
                                style={{
                                    width: "108px",
                                    height: "108px",
                                    backgroundImage: "url('/assets/icons/others/shiny_bg.svg')",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "relative",
                                    opacity: isEarned ? 1 : 0.3, // Dim unearned stars
                                }}
                            >
                                {isEarned && (
                                    <div
                                        style={{
                                            width: "84px",
                                            height: "82px",
                                            overflow: "hidden",
                                            position: "relative"
                                        }}
                                    >
                                        <Image
                                            src="/assets/icons/others/star.svg"
                                            alt="Star"
                                            width={84}
                                            height={82}
                                            style={{
                                                position: "absolute",
                                                left: "50%",
                                                top: "50%",
                                                transform: "translate(-50%, -50%)",
                                                width: "84px",
                                                height: "82px",
                                                objectFit: "cover",
                                                objectPosition: "center center",
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Score Display */}
                <div className="flex items-center gap-2">
                    <span
                        style={{
                            color: "#FF51D4",
                            textAlign: "center",
                            textShadow: "0 0 0 #E451FE",
                            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                            fontSize: "96px",
                            fontStyle: "normal",
                            fontWeight: 600,
                            lineHeight: "102px",
                            letterSpacing: "-1.056px",
                            textTransform: "uppercase",
                        }}
                    >
                        {currentScore}
                    </span>
                    <span
                        style={{
                            color: "#FFF",
                            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                            fontSize: "96px",
                            fontStyle: "normal",
                            fontWeight: 600,
                            lineHeight: "102px",
                            letterSpacing: "-1.056px",
                            textTransform: "uppercase",
                        }}
                    >
                        /{totalScore}
                    </span>
                </div>

                {/* Continue Button */}
                <PrimaryButton
                    text="Continue"
                    size="medium"
                    variant="filled"
                    onClick={() => router.push("/student/home")}
                />
            </div>

            {/* Mascot Avatar - Left Bottom */}
            <div
                className="absolute"
                style={{
                    left: "32px",
                    bottom: "32px",
                }}
            >
                <MascotAvatar
                    imageSrc="/assets/icons/mascots/mascot.png"
                    alt="Mascot"
                />
            </div>
        </div>
    );
}

