import type { FC, SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {}

export const Logo: FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`size-6 ${className}`}
    viewBox="0 0 64 64"
    width="64"
    height="64"
    role="img"
    aria-label="Lightning bolt icon"
  >
    <title>Lightning bolt</title>
    <defs>
      <linearGradient id="grad-yellow-orange" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFD400" />
        <stop offset="100%" stop-color="#FF6A00" />
      </linearGradient>

      <filter id="ds" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.25" />
      </filter>
    </defs>

    <g filter="url(#ds)">
      <path
        fill="url(#grad-yellow-orange)"
        stroke="#E35A00"
        stroke-opacity="0.15"
        stroke-width="1"
        d="M34.5 2.0
             L14.5 36.0
             H28.0
             L22.5 62.0
             L49.5 24.0
             H36.0
             L42.5 2.0
             Z"
      />
    </g>
  </svg>
);
