import type { SVGProps } from "react";

type Star2IconProps = SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
};

export function Star2Icon({ width = 65, height = 37, ...props }: Star2IconProps) {
  const filterId = "star2-glow-filter";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 65 37"
      fill="none"
      {...props}
    >
      <g opacity="0.6" filter={`url(#${filterId})`}>
        <path
          d="M21.2099 9.99993L33.8676 21.397L48.6184 12.8807L41.6906 28.4408L54.3483 39.8379L37.4089 38.0575L30.4811 53.6177L26.9398 36.9572L10.0004 35.1768L24.7512 26.6604L21.2099 9.99993Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id={filterId}
          x="0"
          y="0"
          width="64.3486"
          height="63.6172"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="5" result="effect1_foregroundBlur_4003_2446" />
        </filter>
      </defs>
    </svg>
  );
}
