"use client";

import type { StateYouthRegistration } from "@/types/democracyWorks";
import type { State } from "@/types/state";
import type { StatePop } from "@/types/statePop";
import {
  canRegInGeneral,
  getAge,
  voterEligibilityText,
} from "@/utils/democracyWorksUtils";
import { NO_DATA_COLOR, THREE_COLOR_DIVERGENT_SCALE } from "@/utils/globals";
import { geoIdentity, geoPath } from "d3-geo";
import type { Feature, FeatureCollection } from "geojson";
import { useRouter } from "next/navigation";
import numeral from "numeral";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import topoJson from "us-atlas/states-albers-10m.json";

const CURSOR_OFFSET_Y = 40;
const PANEL_EDGE_PAD = 10;

const topology = topoJson as unknown as Topology;
const geoJson = feature(topology, topology.objects.states) as FeatureCollection;

type Props = {
  width: number;
  height: number;
  className: string;
  youthRegistrations: StateYouthRegistration[];
  states: State[];
  statePops: StatePop[];
  stateRoute: string;
};

export default function NationalPreregMap({
  width,
  height,
  className,
  youthRegistrations,
  states,
  statePops,
  stateRoute,
}: Props) {
  const statesByFips = useMemo(
    () => new Map(states.map((state) => [state.fips, state])),
    [states],
  );

  const statePopsByFips = useMemo(
    () => new Map(statePops.map((statePop) => [statePop.fips, statePop])),
    [statePops],
  );

  const youthRegByState = useMemo(
    () =>
      new Map(youthRegistrations.map((yr) => [yr.state, yr.youthRegistration])),
    [youthRegistrations],
  );

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
  const router = useRouter();

  useLayoutEffect(() => {
    if (hoveredState === null) {
      setTooltipSize(null);
      return;
    }
    const el = tooltipRef.current;
    if (!el) return;
    const { width: w, height: h } = el.getBoundingClientRect();
    setTooltipSize({ width: w, height: h });
  }, [hoveredState]);

  const color = useCallback(
    (fips: string) => {
      const state = statesByFips.get(fips);
      const youth = state ? youthRegByState.get(state.code) : undefined;
      if (!state || !youth) {
        return NO_DATA_COLOR;
      }

      const age = getAge(youth.eligibilityAge);

      if (youth.supported === "byAge" && age <= 16) {
        return THREE_COLOR_DIVERGENT_SCALE[0];
      }

      if (
        (youth.supported === "byAge" && age <= 17) ||
        canRegInGeneral(youth)
      ) {
        return THREE_COLOR_DIVERGENT_SCALE[1];
      }

      if (youth.supported === "byElection" || youth.supported === "byAge") {
        return THREE_COLOR_DIVERGENT_SCALE[2];
      }

      return NO_DATA_COLOR;
    },
    [statesByFips, youthRegByState],
  );

  const projection = useMemo(
    () => geoIdentity().fitSize([width, height], geoJson),
    [width, height],
  );
  const path = useMemo(() => geoPath(projection), [projection]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredState(null);
  }, []);

  const handlePathMouseEnter = useCallback(
    (e: React.MouseEvent<SVGPathElement>) => {
      const fips = e.currentTarget.dataset.fips;
      setMousePosition({ x: e.clientX, y: e.clientY });
      setHoveredState(fips ? (statesByFips.get(fips) ?? null) : null);
    },
    [statesByFips],
  );

  const handlePathClick = useCallback(
    (e: React.MouseEvent<SVGPathElement>) => {
      const fips = e.currentTarget.dataset.fips;
      const state = fips ? statesByFips.get(fips) : undefined;
      if (state) {
        router.push(`${stateRoute}/${state.slug}`);
      }
    },
    [statesByFips, router, stateRoute],
  );

  const { clampedLeft, clampedTop, tooltipMaxHeight } = useMemo(() => {
    const widthForClamp = tooltipSize?.width ?? 0;
    const heightForClamp = tooltipSize?.height ?? 0;
    const winWidth =
      typeof window !== "undefined" ? window.innerWidth : PANEL_EDGE_PAD;
    const winHeight =
      typeof window !== "undefined" ? window.innerHeight : PANEL_EDGE_PAD;
    return {
      clampedLeft: Math.max(
        PANEL_EDGE_PAD,
        Math.min(
          mousePosition.x - widthForClamp / 2,
          winWidth - widthForClamp - PANEL_EDGE_PAD,
        ),
      ),
      clampedTop: Math.max(
        PANEL_EDGE_PAD,
        Math.min(
          mousePosition.y + CURSOR_OFFSET_Y,
          winHeight - heightForClamp - PANEL_EDGE_PAD,
        ),
      ),
      tooltipMaxHeight:
        typeof window !== "undefined"
          ? window.innerHeight - PANEL_EDGE_PAD * 2
          : undefined,
    };
  }, [mousePosition, tooltipSize]);

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
              data-fips={d.id}
              d={path(d) ?? ""}
              className="cursor-pointer fill-transparent stroke-transparent stroke-2 hover:stroke-black"
              strokeWidth={0.8}
              onMouseEnter={handlePathMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handlePathClick}
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
            <div>
              <div className="text-xs font-bold">
                YOU CAN REGISTER TO VOTE IF:
              </div>
              <div className="text-md font-sans font-medium">
                {voterEligibilityText(
                  youthRegByState.get(hoveredState.code) ?? null,
                )}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold">
                RESIDENTS TURNING 18 THIS YEAR:
              </div>
              <div className="text-md font-sans font-medium">
                {numeral(
                  statePopsByFips.get(hoveredState.fips)?.pop18 ?? 0,
                ).format("0,0")}
              </div>
            </div>
          </div>
          <div className="bg-sand-500 body-sm px-4 py-1 text-xs font-semibold text-gray-500">
            Click the state to learn more.
          </div>
        </div>
      )}
    </div>
  );
}
