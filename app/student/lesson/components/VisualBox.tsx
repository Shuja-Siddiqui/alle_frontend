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
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
        />
      )}
    </div>
  );
}



