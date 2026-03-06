"use client";

import clsx from "clsx";
import { stateSvgs } from "./stateSvgs";

const SIZE_MAP = {
  sm: 30,
  md: 60,
  lg: 90,
  xl: 120,
} as const;

type SizeKey = keyof typeof SIZE_MAP;

type StateIconProps = {
  /** Two-letter state code (e.g. AK, AZ, CA) */
  code: string;
  /** Size preset: sm=30px, md=60px, lg=90px, xl=120px */
  size?: SizeKey;
  /** Tailwind classes for styling, e.g. fill-green-600 or text-blue-500 */
  className?: string;
};

export function StateIcon({
  code,
  size = "md",
  className,
}: StateIconProps) {
  const normalizedCode = code?.toUpperCase().trim() ?? "";
  const sizePx = SIZE_MAP[size];
  const svgData =
    normalizedCode && normalizedCode in stateSvgs
      ? stateSvgs[normalizedCode]
      : null;

  if (!svgData || !normalizedCode) {
    return (
      <span
        className={clsx("inline-flex items-center justify-center", className)}
        style={{ width: sizePx, height: sizePx }}
        aria-hidden
      >
        —
      </span>
    );
  }

  return (
    <svg
      viewBox={svgData.viewBox}
      width={sizePx}
      height={sizePx}
      className={clsx("shrink-0", className)}
      style={{
        maxWidth: sizePx,
        maxHeight: sizePx,
      }}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <g fill="currentColor">
        {/* eslint-disable-next-line react/no-danger */}
        <g dangerouslySetInnerHTML={{ __html: svgData.innerHtml }} />
      </g>
    </svg>
  );
}
