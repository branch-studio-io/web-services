"use client";

import clsx from "clsx";
import { stateSvgs } from "./stateSvgs";

type Dimension = number | string;

type StateIconProps = {
  /** Two-letter state code (e.g. AK, AZ, CA) */
  code: string;
  /** Tailwind classes for styling, e.g. fill-green-600 or text-blue-500 */
  className?: string;
  /**
   * Explicit width/height for the SVG. When provided, these are applied as
   * `width`/`height` attributes and take precedence over size set by parents.
   * Accepts numbers (pixels) or any valid CSS length string.
   */
  size?: Dimension;
  width?: Dimension;
  height?: Dimension;
};

const toDimension = (value?: Dimension): string | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === "number") return `${value}px`;
  return value;
};

/**
 * Renders a state shape SVG.
 *
 * - By default, size is determined by the wrapper element; the SVG fills
 *   100% width/height and preserves aspect ratio (xMidYMid meet).
 * - When `size`, `width`, or `height` props are provided, those are applied
 *   directly as `width`/`height` attributes on the SVG.
 */
export function StateIcon({
  code,
  className,
  size,
  width,
  height,
}: StateIconProps) {
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

  const resolvedWidth = toDimension(size ?? width);
  const resolvedHeight = toDimension(size ?? height);
  const hasExplicitDimensions = Boolean(resolvedWidth || resolvedHeight);

  return (
    <svg
      overflow="visible"
      width={resolvedWidth ?? resolvedHeight}
      height={resolvedHeight ?? resolvedWidth}
      viewBox={svgData.viewBox}
      className={clsx(
        "shrink-0",
        !hasExplicitDimensions && "h-full w-full",
        className,
      )}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <g fill="currentColor">
        <g dangerouslySetInnerHTML={{ __html: svgData.innerHtml }} />
      </g>
    </svg>
  );
}
