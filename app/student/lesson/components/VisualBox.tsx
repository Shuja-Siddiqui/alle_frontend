import Image from "next/image";

type VisualBoxProps = {
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  className?: string;
  /**
   * When true, applies the platform's pink/violet tint to the image so it
   * matches the rest of the UI (used for OpenMoji illustrations).
   */
  tintToPlatform?: boolean;
};

const PLATFORM_TINT_FILTER =
  "grayscale(1) contrast(1.18) brightness(1.08) sepia(1) hue-rotate(285deg) saturate(4.2)";

export function VisualBox({
  imageSrc,
  imageAlt = "",
  imageWidth = 100,
  imageHeight = 100,
  className,
  tintToPlatform = false,
}: VisualBoxProps) {
  const isValidImageSrc =
    typeof imageSrc === "string" &&
    imageSrc.trim().length > 0 &&
    (imageSrc.startsWith("/") ||
      imageSrc.startsWith("http://") ||
      imageSrc.startsWith("https://"));

  const imageStyle = tintToPlatform
    ? { filter: PLATFORM_TINT_FILTER, opacity: 0.98 }
    : undefined;

  return (
    <div
      className={`flex h-[140px] w-[281px] items-center justify-center gap-[10px] px-[77px] py-[45px] ${className ?? ""}`}
      style={{
        borderRadius: "41.186px",
        border: "1.318px solid rgba(255, 255, 255, 0.24)",
        background:
          "linear-gradient(111deg, rgba(222, 33, 255, 0.00) 51.68%, #DE21FF 173.36%)",
        boxShadow: "0 0 0 0.859px #E451FE",
      }}
    >
      {isValidImageSrc ? (
        <Image
          src={imageSrc as string}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          style={imageStyle}
        />
      ) : imageSrc ? (
        <span className="text-center text-sm text-white">{imageAlt || imageSrc}</span>
      ) : null}
    </div>
  );
}



