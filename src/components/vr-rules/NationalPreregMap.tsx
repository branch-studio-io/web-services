"use client";

import type { Authority } from "@/types/democracyWorks";
import { PreregStatus } from "@/types/democracyWorks";
import type { State } from "@/types/state";
import type { StatePop } from "@/types/statePop";
import { getPreregStatus } from "@/utils/democracyWorkApi";
import {
  parseStateCode,
  PREREG_STATUS_COLORS,
  voterEligibilityParts,
} from "@/utils/democracyWorksUtils";
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
  authorities: Authority[];
  states: State[];
  statePops: StatePop[];
  stateRoute: string;
};

export default function NationalPreregMap({
  width,
  height,
  className,
  authorities,
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
      new Map(
        authorities.map((a) => [parseStateCode(a.ocdId), a.youthRegistration]),
      ),
    [authorities],
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
      if (!state) {
        return PREREG_STATUS_COLORS[PreregStatus.NOT_AVAILABLE];
      }
      const status = getPreregStatus(youth);
      return PREREG_STATUS_COLORS[status];
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
              className="cursor-pointer fill-transparent transition-colors duration-300 ease-out hover:fill-black/15 hover:stroke-black/15 hover:stroke-2"
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
          className="bg-grey-light pointer-events-none z-10 flex w-[430px] flex-col justify-between overflow-y-auto rounded-md drop-shadow-lg"
          style={{
            position: "fixed",
            left: tooltipSize === null ? -9999 : clampedLeft,
            top: clampedTop,
            maxHeight: tooltipMaxHeight,
            visibility: tooltipSize === null ? "hidden" : "visible",
          }}
        >
          <div className="space-y-2 p-6">
            <h3 className="header-3 font-bold">{hoveredState.name}</h3>
            <div className="space-y-3 font-sans text-base leading-normal font-extrabold">
              <p>
                You can register to vote if:{" "}
                {(() => {
                  const youthReg = youthRegByState.get(hoveredState.code);
                  if (!youthReg) return "—";
                  const { intro, main, note } = voterEligibilityParts(youthReg);
                  return (
                    <>
                      <span className="underline-highlight">
                        {intro && <>{intro} </>}
                        {main}
                      </span>
                      {note && <> {note}</>}
                    </>
                  );
                })()}
              </p>
              <p>
                Number of residents turning 18 this year:{" "}
                <span className="underline-highlight">
                  {numeral(
                    statePopsByFips.get(hoveredState.fips)?.pop18 ?? 0,
                  ).format("0,0")}
                </span>
              </p>
              <p>Click for more info:</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
