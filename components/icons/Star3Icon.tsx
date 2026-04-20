import type { SVGProps } from "react";

type Star3IconProps = SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
};

export function Star3Icon({ width = 57, height = 34, ...props }: Star3IconProps) {
  const filterId = "star3-glow-filter";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 57 34"
      fill="none"
      {...props}
    >
      <g opacity="0.76" filter={`url(#${filterId})`}>
        <path
          d="M21.8445 10.0001L31.1672 20.7261L44.2491 15.1742L36.9289 27.3551L46.2516 38.0811L32.4048 34.8833L25.0846 47.0642L23.847 32.907L10.0003 29.7092L23.0821 24.1573L21.8445 10.0001Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id={filterId}
          x="0"
          y="0"
          width="56.252"
          height="57.0645"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="5" result="effect1_foregroundBlur_4003_2447" />
        </filter>
      </defs>
    </svg>
  );
}
