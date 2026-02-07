"use client";

import { THREE_COLOR_DIVERGENT_SCALE } from "@/utils/globals";
import { geoIdentity, geoPath } from "d3-geo";
import type { Feature, FeatureCollection } from "geojson";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import topoJson from "us-atlas/states-albers-10m.json";

type Props = {
  width: number;
  height: number;
  className: string;
};

export default function NationalPreregMap({ width, height, className }: Props) {
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
        {geoJson.features.map((d: Feature, i: number) => {
          return (
            <path
              key={`${d.id}`}
              d={path(d) || ""}
              fill={THREE_COLOR_DIVERGENT_SCALE[i % 3]}
              stroke="white"
              strokeWidth={0.8}
            />
          );
        })}
      </g>
    </svg>
  );
}
