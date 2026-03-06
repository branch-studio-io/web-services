"use client";

import { StateIcon } from "@/components/StateIcon";
import type { Authority } from "@/types/democracyWorks";
import type { State } from "@/types/state";
import {
  parseStateCode,
  voterEligibilityText,
} from "@/utils/democracyWorksUtils";
import Link from "next/link";
import { useMemo } from "react";

const getStateCodeFromOcdId = (ocdId: string): string => {
  if (ocdId.includes("district:dc")) return "DC";
  return parseStateCode(ocdId);
};

type Props = {
  states: State[];
  authorities: Authority[];
};

export default function StateList({ states, authorities }: Props) {
  const youthRegByState = useMemo(
    () =>
      new Map(
        authorities.map((a) => [
          getStateCodeFromOcdId(a.ocdId),
          a.youthRegistration,
        ]),
      ),
    [authorities],
  );

  return (
    <ul className="flex flex-col gap-6">
      {states.map((state) => {
        const youthReg = youthRegByState.get(state.code);
        return (
          <li
            key={state.fips}
            className="flex items-center gap-6 border-sand-600 border-b border-solid pb-6 last:border-b-0 last:pb-0"
          >
            <StateIcon
              code={state.code}
              size="xl"
              className="shrink-0 fill-cc-teal"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h3 className="font-bold text-gray-950">{state.name}</h3>
              <p className="font-sans text-base text-gray-950">
                {youthReg ? voterEligibilityText(youthReg) : "—"}
              </p>
              <Link
                href={`/vr-rules/${state.slug}`}
                className="font-sans text-base font-bold text-gray-950 hover:underline focus:underline focus:outline-none"
              >
                See all about {state.name}
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
