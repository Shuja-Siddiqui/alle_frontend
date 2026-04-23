"use client";

import Image from "next/image";
import type { ReactNode, MouseEventHandler } from "react";
import { Star1Icon } from "./icons/Star1Icon";
import { Star2Icon } from "./icons/Star2Icon";
import { Star3Icon } from "./icons/Star3Icon";

type ConfirmCancelDialogProps = {
    open: boolean;
    title?: string;
    description?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    /** Optional leading icon for confirm button */
    confirmIconSrc?: string;
    /** Optional leading icon for cancel button */
    cancelIconSrc?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    /** Called when backdrop is clicked or ESC pressed */
    onClose?: () => void;
};

export function ConfirmCancelDialog({
    open,
    title = "Are you sure?",
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    confirmIconSrc,
    cancelIconSrc,
    onConfirm,
    onCancel,
    onClose,
}: ConfirmCancelDialogProps) {
    if (!open) return null;

    const handleBackdropClick: MouseEventHandler<HTMLDivElement> = (event) => {
        if (event.target === event.currentTarget) {
            onClose?.();
        }
    };

    return (
        <div
            className="fixed inset-0 z-40 flex items-center justify-center"
            style={{
                background: "rgba(0, 0, 32, 0.80)",
            }}
            onClick={handleBackdropClick}
        >
            <div
                 className="inline-flex flex-col items-center gap-[32px] rounded-[51.22px] border-2 border-[#E451FE] p-[44px] text-white shadow-[0_0_40px_rgba(0,0,0,0.8)]"
                style={{
                    background:
                        "linear-gradient(155deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
                }}
            >
                <h2
                    className="mb-0 text-center"
                    style={{
                        color: "#FFFFFF",
                        fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                        fontSize: "36px",
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: "42px",
                        letterSpacing: "-0.396px",
                        textTransform: "uppercase",
                    }}
                >
                    {title}
                </h2>


                <div className="flex items-start justify-center gap-[32px]">
                    {/* Cancel button */}
                    <button
                        type="button"
                        className="flex min-h-[70px] min-w-[234.18px] cursor-pointer items-center justify-center gap-[12px] rounded-full border border-[#434B93] px-[23.902px] py-[9.612px] text-sm text-[#B0B3FF] transition hover:bg-white/5"
                        onClick={onCancel}
                    >
                        {cancelIconSrc && (
                            <Image src={cancelIconSrc} alt="" width={34} height={34} />
                        )}
                         <span
                            style={{
                                color: "#FFFFFF",
                                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                                fontSize: "22.927px",
                                fontStyle: "normal",
                                fontWeight: 700,
                                lineHeight: "150%",
                                letterSpacing: "-0.252px",
                                textTransform: "uppercase",
                            }}
                         className="whitespace-nowrap"
                         >
                            {cancelLabel}
                        </span>
                    </button>

                    {/* Confirm button (success variant) */}
                    <button
                        type="button"
                        className="group relative flex min-h-[70px] min-w-[234.18px] cursor-pointer items-center justify-center gap-[12px] overflow-hidden rounded-full border-2 border-[#FFFFFF3D] px-[23.902px] py-[9.612px] text-sm font-medium text-white transition hover:brightness-110 shadow-[0px_0px_0px_1.6px_#E451FE] hover:shadow-[0px_0px_18.7px_1.602px_#ff00c8]"
                        style={{
                            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                            backgroundImage:
                                "linear-gradient(88.47deg, #F529F9 1.65%, #0756FF 57.2%, #FF21C8 89.22%)",
                        }}
                        onClick={onConfirm}
                    >
                        {/* Decorative stars: default PNGs */}
                        <div className="pointer-events-none absolute inset-0 transition-opacity group-hover:opacity-0">
                            <div className="absolute right-[52px] top-[-4px] opacity-70">
                                <Image src="/assets/icons/others/star1.png" alt="" width={28} height={28} />
                            </div>
                            <div className="absolute left-[30px] bottom-[-2px] opacity-80">
                                <Image src="/assets/icons/others/star2.png" alt="" width={32} height={32} />
                            </div>
                            <div className="absolute right-[86px] bottom-[-2px] opacity-60">
                                <Image src="/assets/icons/others/star3.png" alt="" width={26} height={26} />
                            </div>
                        </div>

                        {/* Hover stars: glowing SVGs */}
                        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                            <div className="absolute right-[52px] top-[-4px]">
                                <Star1Icon width={28} height={28} />
                            </div>
                            <div className="absolute left-[30px] bottom-[-2px]">
                                <Star2Icon width={32} height={32} />
                            </div>
                            <div className="absolute right-[86px] bottom-[-2px]">
                                <Star3Icon width={26} height={26} />
                            </div>
                        </div>

                        {confirmIconSrc && (
                            <Image src={confirmIconSrc} alt="" width={30.3} height={30.3} />
                        )}
                         <span
                             className="relative z-10 whitespace-nowrap"
                            style={{
                                color: "#FFFFFF",
                                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                                fontSize: "22.927px",
                                fontStyle: "normal",
                                fontWeight: 700,
                                lineHeight: "150%",
                                letterSpacing: "-0.252px",
                                textTransform: "uppercase",
                            }}
                        >
                            {confirmLabel}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

