"use client";

import type { State } from "@/payload-types";
import type { YouthRegistration } from "@/types/democracy-works";
import { canRegInGeneral, getAge } from "@/utils/democracyWorksUtils";
import { NO_DATA_COLOR, THREE_COLOR_DIVERGENT_SCALE } from "@/utils/globals";
import { geoIdentity, geoPath } from "d3-geo";
import type { Feature, FeatureCollection } from "geojson";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import topoJson from "us-atlas/states-albers-10m.json";

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

  return (
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
          />
        ))}
      </g>
    </svg>
  );
}
