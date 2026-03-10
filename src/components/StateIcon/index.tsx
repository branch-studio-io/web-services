"use client";

import clsx from "clsx";
import { stateSvgs } from "./stateSvgs";

type StateIconProps = {
  /** Two-letter state code (e.g. AK, AZ, CA) */
  code: string;
  /** Tailwind classes for styling, e.g. fill-green-600 or text-blue-500 */
  className?: string;
};

/**
 * Renders a state shape SVG. Size is determined by the wrapper element;
 * the SVG fills 100% width/height and preserves aspect ratio (xMidYMid meet).
 */
export function StateIcon({ code, className }: StateIconProps) {
  const normalizedCode = code?.toUpperCase().trim() ?? "";
  const svgData =
    normalizedCode && normalizedCode in stateSvgs
      ? stateSvgs[normalizedCode]
      : null;

  if (!svgData || !normalizedCode) {
    return (
      <span
        className={clsx("inline-flex items-center justify-center", className)}
        aria-hidden
      >
        —
      </span>
    );
  }

  return (
    <svg
      viewBox={svgData.viewBox}
      className={clsx("h-full w-full shrink-0", className)}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <g fill="currentColor">
        <g dangerouslySetInnerHTML={{ __html: svgData.innerHtml }} />
      </g>
    </svg>
  );
}
