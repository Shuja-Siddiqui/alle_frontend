"use client";

import Image from "next/image";

type ContactDetailsProps = {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    phoneNumber?: string;
    email?: string;
    language?: string;
    timezone?: string;
    onEditClick?: () => void;
};

export function ContactDetails({
    firstName = "James",
    lastName = "Dembele",
    dateOfBirth = "12.21.1984",
    phoneNumber = "4 222 321 321 23",
    email = "j.dembele@edu.com",
    language = "English",
    timezone = "GMT-5 (Eastern Time)",
    onEditClick,
}: ContactDetailsProps) {
    const fields = [
        { label: "First name", value: firstName },
        { label: "Last name", value: lastName },
        { label: "Date of Birth", value: dateOfBirth },
        { label: "Phone number", value: phoneNumber },
        { label: "Email", value: email },
        { label: "Language", value: language },
        { label: "Timezone", value: timezone },
    ];

    return (
        <div
            className="relative flex flex-col gap-[24px] items-start overflow-hidden p-[32px] rounded-[36px] w-full"
            style={{
                backgroundImage: "linear-gradient(157.83deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between relative shrink-0 w-full">
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
                    Contact details
                </p>
                {onEditClick && (
                    <button
                        type="button"
                        onClick={onEditClick}
                        className="relative shrink-0 cursor-pointer bg-transparent border-none "
                        style={{
                            width: "56px",
                            height: "56px",
                            padding: "7.689px 19.122px",
                            borderRadius: "61.463px",
                            border: "1.6px solid #F529F9",
                            boxShadow:" 0 0 0 1.282px #E451FE",
                        }}
                    >
                        <Image
                            src="/assets/icons/others/edit.svg"
                            alt="Edit"
                            width={28}
                            height={28}
                            className="block"
                        />
                    </button>
                )}
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                {fields.map((field, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between relative shrink-0 w-full"
                    >
                        <p
                            style={{
                                color: "#FFF",
                                fontFamily: "Orbitron",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 500,
                                lineHeight: "150%",
                                letterSpacing: "-0.176px",
                            }}
                        >
                            {field.label}
                        </p>
                        <p
                            style={{
                                color: "var(--Colors-Primary, #FF00CA)",
                                fontFamily: "Orbitron",
                                fontSize: "18px",
                                fontStyle: "normal",
                                fontWeight: 500,
                                lineHeight: "150%",
                                letterSpacing: "-0.198px",
                            }}
                        >
                            {field.value}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

