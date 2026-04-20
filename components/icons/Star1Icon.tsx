import type { SVGProps } from "react";

type Star1IconProps = SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
};

export function Star1Icon({ width = 58, height = 34, ...props }: Star1IconProps) {
  const filterId = "star1-glow-filter";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 58 34"
      fill="none"
      {...props}
    >
      <g opacity="0.9" filter={`url(#${filterId})`}>
        <path
          d="M19.5168 -13.097L30.2629 -3.42113L42.7859 -10.6513L36.9044 2.55889L47.6505 12.2348L33.2694 10.7232L27.3878 23.9334L24.3813 9.78907L10.0002 8.27755L22.5232 1.04737L19.5168 -13.097Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id={filterId}
          x="0"
          y="-23.0967"
          width="57.6504"
          height="57.0303"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="5" result="effect1_foregroundBlur_4003_2444" />
        </filter>
      </defs>
    </svg>
  );
}
