import Image from "next/image";

type VisualBoxProps = {
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  className?: string;
};

export function VisualBox({
  imageSrc,
  imageAlt = "",
  imageWidth = 100,
  imageHeight = 100,
  className,
}: VisualBoxProps) {
  const isValidImageSrc =
    typeof imageSrc === "string" &&
    imageSrc.trim().length > 0 &&
    (imageSrc.startsWith("/") ||
      imageSrc.startsWith("http://") ||
      imageSrc.startsWith("https://"));

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
        />
      ) : imageSrc ? (
        <span className="text-center text-sm text-white">{imageAlt || imageSrc}</span>
      ) : null}
    </div>
  );
}



