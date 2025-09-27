import type { FC, SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {}

export const Hamburger: FC<IconProps> = ({ className }) => (
  <svg className={`h-6 w-6 fill-current ${className}`} viewBox="0 0 24 24">
    <title>Hamburger icon</title>
    <path
      fillRule="evenodd"
      d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
    />
  </svg>
);
