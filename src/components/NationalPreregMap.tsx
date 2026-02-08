"use client";

import type { State } from "@/payload-types";
import type { YouthRegistration } from "@/types/democracy-works";
import { canRegInGeneral, getAge } from "@/utils/democracyWorksUtils";
import { NO_DATA_COLOR, THREE_COLOR_DIVERGENT_SCALE } from "@/utils/globals";
import { geoIdentity, geoPath } from "d3-geo";
import type { Feature, FeatureCollection } from "geojson";
import { useCallback, useState } from "react";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import topoJson from "us-atlas/states-albers-10m.json";

const PANEL_WIDTH = 400;
const PANEL_MIN_HEIGHT = 150;
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

  const clampedLeft = Math.max(
    PANEL_EDGE_PAD,
    Math.min(
      mousePosition.x - PANEL_WIDTH / 2,
      typeof window !== "undefined"
        ? window.innerWidth - PANEL_WIDTH - PANEL_EDGE_PAD
        : PANEL_EDGE_PAD,
    ),
  );
  const clampedTop = Math.max(
    PANEL_EDGE_PAD,
    Math.min(
      mousePosition.y + CURSOR_OFFSET_Y,
      typeof window !== "undefined"
        ? window.innerHeight - PANEL_MIN_HEIGHT - PANEL_EDGE_PAD
        : PANEL_EDGE_PAD,
    ),
  );

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
          role="tooltip"
          aria-label={`State: ${hoveredState.name}`}
          className="bg-sand-300 pointer-events-none z-10 flex min-h-[150px] w-[400px] flex-col justify-between rounded-md drop-shadow-lg"
          style={{
            position: "fixed",
            left: clampedLeft,
            top: clampedTop,
          }}
        >
          <div className="p-4">
            <h3 className="header-4">{hoveredState.name}</h3>
          </div>
          <div className="bg-sand-500 body-sm px-4 py-1 text-xs text-gray-500">
            Click the state to learn more.
          </div>
        </div>
      )}
    </div>
  );
}
