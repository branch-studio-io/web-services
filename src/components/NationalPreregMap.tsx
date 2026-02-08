"use client";

import type { State } from "@/payload-types";
import type { YouthRegistration } from "@/types/democracy-works";
import { canRegInGeneral, getAge } from "@/utils/democracyWorksUtils";
import { NO_DATA_COLOR, THREE_COLOR_DIVERGENT_SCALE } from "@/utils/globals";
import { geoIdentity, geoPath } from "d3-geo";
import type { Feature, FeatureCollection } from "geojson";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import topoJson from "us-atlas/states-albers-10m.json";

const CURSOR_OFFSET_Y = 40;
const PANEL_EDGE_PAD = 10;

type Props = {
  width: number;
  height: number;
  className: string;
  youthRegistration: Record<string, YouthRegistration>;
  states: State[];
};

export default function NationalPreregMap({
  width,
  height,
  className,
  youthRegistration,
  states,
}: Props) {
  const fipsLookup = new Map(states.map((state) => [state.fips, state]));
  const [hoveredState, setHoveredState] = useState<State | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [tooltipSize, setTooltipSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (hoveredState === null) {
      setTooltipSize(null);
      return;
    }
    const el = tooltipRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    setTooltipSize({ width, height });
  }, [hoveredState]);

  const color = (fips: string) => {
    const state = fipsLookup.get(fips);
    const youth = youthRegistration[state.code];
    if (!state || !youth) {
      return NO_DATA_COLOR;
    }

    const age = getAge(youth.eligibilityAge);

    // Preregistration starts at age 16 or earlier
    if (youth.supported === "byAge" && age <= 16) {
      return THREE_COLOR_DIVERGENT_SCALE[0];
    }

    // State allows at least one year to register before the first election but do not start at age 16
    if ((youth.supported === "byAge" && age <= 17) || canRegInGeneral(youth)) {
      return THREE_COLOR_DIVERGENT_SCALE[1];
    }

    //States with shorter preregistration periods; most have time to register in senior year.
    if (youth.supported === "byElection" || youth.supported === "byAge") {
      return THREE_COLOR_DIVERGENT_SCALE[2];
    }

    return NO_DATA_COLOR;
  };

  const topology = topoJson as unknown as Topology;

  const geoJson = feature(
    topology,
    topology.objects.states,
  ) as FeatureCollection;

  const projection = geoIdentity().fitSize([width, height], geoJson);
  const path = geoPath(projection);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredState(null);
  }, []);

  const widthForClamp = tooltipSize?.width ?? 0;
  const heightForClamp = tooltipSize?.height ?? 0;
  const clampedLeft = Math.max(
    PANEL_EDGE_PAD,
    Math.min(
      mousePosition.x - widthForClamp / 2,
      typeof window !== "undefined"
        ? window.innerWidth - widthForClamp - PANEL_EDGE_PAD
        : PANEL_EDGE_PAD,
    ),
  );
  const preferredTop = mousePosition.y + CURSOR_OFFSET_Y;
  const clampedTop = Math.max(
    PANEL_EDGE_PAD,
    Math.min(
      preferredTop,
      typeof window !== "undefined"
        ? window.innerHeight - heightForClamp - PANEL_EDGE_PAD
        : PANEL_EDGE_PAD,
    ),
  );
  const tooltipMaxHeight =
    typeof window !== "undefined"
      ? window.innerHeight - PANEL_EDGE_PAD * 2
      : undefined;

  return (
    <div
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="img"
      aria-label="US map of state preregistration requirements"
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid meet"
        className={className}
      >
        <g>
          {geoJson.features.map((d: Feature) => (
            <path
              key={`b-${d.id}`}
              d={path(d) ?? ""}
              fill={color(String(d.id))}
              stroke="white"
              strokeWidth={0.8}
            />
          ))}
        </g>
        <g>
          {geoJson.features.map((d: Feature) => (
            <path
              key={`h-${d.id}`}
              d={path(d) ?? ""}
              className="cursor-pointer fill-transparent stroke-transparent stroke-2 hover:stroke-black"
              strokeWidth={0.8}
              onMouseEnter={(e) => {
                setMousePosition({ x: e.clientX, y: e.clientY });
                setHoveredState(fipsLookup.get(String(d.id)) ?? null);
              }}
              onMouseLeave={() => setHoveredState(null)}
            />
          ))}
        </g>
      </svg>
      {hoveredState !== null && (
        <div
          ref={tooltipRef}
          role="tooltip"
          aria-label={`State: ${hoveredState.name}`}
          className="bg-sand-300 pointer-events-none z-10 flex w-[400px] flex-col justify-between overflow-y-auto rounded-md drop-shadow-lg"
          style={{
            position: "fixed",
            left: tooltipSize === null ? -9999 : clampedLeft,
            top: clampedTop,
            maxHeight: tooltipMaxHeight,
            visibility: tooltipSize === null ? "hidden" : "visible",
          }}
        >
          <div className="space-y-2 p-4">
            <h3 className="header-3 font-bold">{hoveredState.name}</h3>
            <p className="font-sans text-sm font-medium">
              <div>
                YOU CAN REGISTER TO VOTE IF:{" "}
                {eligibilityText(youthRegistration[hoveredState.code])}
              </div>
            </p>
            <p className="font-sans text-sm font-medium">
              # OF RESIDENTS TURNING 18 THIS YEAR: ???
            </p>
          </div>
          <div className="bg-sand-500 body-sm px-4 py-1 text-xs font-semibold text-gray-500">
            Click the state to learn more.
          </div>
        </div>
      )}
    </div>
  );
}

function eligibilityText(yr: YouthRegistration) {
  if (yr.supported === "byAge") {
    return `You are ${formatEligibilityAge(yr.eligibilityAge)} of age or older.`;
  }
  if (yr.supported === "byElection") {
    return `You will be XXX by the election on YYYY.`;
  }
  return "Other!!!";
}

function formatEligibilityAge(eligibilityAge: string) {
  const str = eligibilityAge.replace(/^P/, "");
  const parts: string[] = [];
  const yMatch = str.match(/(\d+)Y/);
  const mMatch = str.match(/(\d+)M/);
  const dMatch = str.match(/(\d+)D/);
  if (yMatch) parts.push(`${yMatch[1]} years`);
  if (mMatch) parts.push(`${mMatch[1]} months`);
  if (dMatch) parts.push(`${dMatch[1]} days`);
  if (parts.length === 0) return eligibilityAge;
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts[0]}, ${parts[1]} and ${parts[2]}`;
}
