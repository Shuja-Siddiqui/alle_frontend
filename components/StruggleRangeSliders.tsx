"use client";

import Image from "next/image";

type StruggleData = {
    module: string;
    percentage: number;
    struggling: number;
    total: number;
};

type StruggleRangeSlidersProps = {
    /** Array of struggle data */
    struggleData: StruggleData[];
    /** Optional className */
    className?: string;
};

const defaultData: StruggleData[] = [
    { module: "Module 1, Lesson 5", percentage: 23, struggling: 28, total: 120 },
    { module: "Module 2, Lesson 4-5", percentage: 56, struggling: 61, total: 117 },
    { module: "Module 3, Lesson 3", percentage: 78, struggling: 71, total: 94 },
];

export function StruggleRangeSliders({
    struggleData = defaultData,
    className,
}: StruggleRangeSlidersProps) {
    return (
        <div
            className={`flex flex-col gap-[24px] items-start overflow-clip p-[24px] relative rounded-[32px] ${className ?? ""}`}
            style={{
                backgroundImage: "linear-gradient(172.6deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
                width: "752px",
                height: "205px",
            }}
        >
            {/* Header */}
            <div className="flex items-center relative w-full">
                <p
                    style={{
                        color: "#FFFFFF",
                        fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                        fontSize: "28px",
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: "1.5",
                        letterSpacing: "-0.308px",
                        textTransform: "uppercase",
                    }}
                >
                    Where students struggle the most
                </p>
            </div>

            {/* Struggle Items */}
            <div className="flex gap-[23px] items-start relative w-full">
                {struggleData.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="flex flex-col gap-[16px] items-start py-px relative shrink-0"
                            style={{ width: "219px" }}
                        >
                            {/* Module header */}
                            <div className="flex font-medium items-center justify-between leading-[20px] relative shrink-0 text-[14px] tracking-[-0.28px] w-full">
                                <p
                                    style={{
                                        color: "#FFFFFF",
                                        fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                                        fontWeight: 500,
                                    }}
                                >
                                    {item.module}
                                </p>
                                <p
                                    style={{
                                        color: "#ff00ca",
                                        fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                                        fontWeight: 500,
                                    }}
                                >
                                    {item.percentage}%
                                </p>
                            </div>

                            {/* Progress bar container */}
                            <div className="flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                                <div className="h-[22px] relative shrink-0 w-full">
                                    {/* Track bar - full width, pill shape, clips inner gradient */}
                                    <div
                                        className="absolute left-0 top-[0.5px]"
                                        style={{
                                            width: "100%",
                                            height: "21px",
                                            borderRadius: "40px",
                                            border: "1.261px solid rgba(67,75,147,0.24)",
                                            backgroundColor: "#434b93",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {/* Filled gradient portion */}
                                        <div
                                            className="h-full"
                                            style={{
                                                width: `${item.percentage}%`,
                                                borderRadius: "40px",
                                                borderRight: "1.261px solid rgba(255,255,255,0.24)",
                                                backgroundImage:
                                                    "linear-gradient(90deg, rgb(7, 86, 255) 0%, rgb(245, 41, 249) 55%, rgb(255, 33, 199) 100%)",
                                                backgroundSize: "100% 100%",
                                                backgroundPosition: "0 0",
                                                backgroundRepeat: "no-repeat",
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Struggle count text */}
                                <p
                                    style={{
                                        color: "#7478a2",
                                        fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                                        fontSize: "14px",
                                        fontStyle: "normal",
                                        fontWeight: 500,
                                        lineHeight: "20px",
                                        letterSpacing: "-0.28px",
                                    }}
                                >
                                    {item.struggling} of {item.total} struggling
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

