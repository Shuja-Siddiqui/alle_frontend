"use client";

import Image from "next/image";
import type { ReactNode, MouseEventHandler } from "react";

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
                        className="flex min-h-[70px] min-w-[234.18px] items-center justify-center gap-[12px] rounded-full border border-[#434B93] px-[23.902px] py-[9.612px] text-sm text-[#B0B3FF] transition hover:bg-white/5"
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
                        className="relative flex min-h-[70px] min-w-[234.18px] items-center justify-center gap-[12px] overflow-hidden rounded-full border-2 border-[#FFFFFF3D] px-[23.902px] py-[9.612px] text-sm font-medium text-white transition hover:brightness-110"
                        style={{
                            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                            backgroundImage:
                                "linear-gradient(88.47deg, #F529F9 1.65%, #0756FF 57.2%, #FF21C8 89.22%)",
                            boxShadow: "0px 0px 0px 1.6px #E451FE",
                        }}
                        onClick={onConfirm}
                    >
                        {/* Single decorative star, similar to PrimaryButton but only one */}
                        <div className="pointer-events-none absolute left-[45px] bottom-0 opacity-80">
                            <Image
                                src="/assets/icons/others/star2.png"
                                alt=""
                                width={39}
                                height={39}
                            />
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

