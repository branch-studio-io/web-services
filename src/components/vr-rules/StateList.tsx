"use client";

import { StateIcon } from "@/components/StateIcon";
import type { Authority } from "@/types/democracyWorks";
import type { State } from "@/types/state";
import {
  parseStateCode,
  voterEligibilityText,
} from "@/utils/democracyWorksUtils";
import { MAX_WIDTH } from "@/utils/globals";
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
    <ul className="flex flex-col">
      {states.map((state, index) => {
        const youthReg = youthRegByState.get(state.code);
        const rowBg = index % 2 === 0 ? "bg-white" : "bg-sand";
        return (
          <li key={state.fips} className={`w-full ${rowBg}`}>
            <div
              className="mx-auto flex items-center gap-6 px-6 py-4 lg:px-8"
              style={{ maxWidth: MAX_WIDTH }}
            >
              <StateIcon
                code={state.code}
                size="lg"
                className="shrink-0 text-cc-teal drop-shadow-md"
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
            </div>
          </li>
        );
      })}
    </ul>
  );
}
