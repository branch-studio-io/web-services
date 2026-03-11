"use client";

import { StateIcon } from "@/components/StateIcon";
import type { Authority } from "@/types/democracyWorks";
import type { State } from "@/types/state";
import {
  parseStateCode,
  voterEligibilityParts,
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
        const briefEligibility =
          youthReg &&
          (() => {
            const { main, note } = voterEligibilityParts(youthReg);
            return [main, note].filter(Boolean).join(" ");
          })();
        const rowBg = index % 2 === 0 ? "bg-white" : "bg-beige";
        return (
          <li key={state.fips} className={`w-full ${rowBg}`}>
            <div
              className="mx-auto flex flex-col items-center gap-x-10 gap-y-6 px-6 py-4 md:flex-row md:items-start md:px-8"
              style={{ maxWidth: MAX_WIDTH }}
            >
              <Link
                href={`/vr-rules/${state.slug}`}
                className="block h-[120px] w-[120px] shrink-0 cursor-pointer text-[#90D2DC] drop-shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 md:h-[100px] md:w-[100px]"
                aria-label={`See all voter registration rules for ${state.name}`}
              >
                <StateIcon code={state.code} />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col w-full text-left">
                <h3 className="header-5 font-bold">{state.name}</h3>
                <p className="body-md">
                  <strong>Voter registration age:</strong>{" "}
                  {briefEligibility ?? "—"}
                </p>
                <Link
                  href={`/vr-rules/${state.slug}`}
                  className="body-sm mt-1 font-bold hover:underline hover:decoration-2 hover:underline-offset-2 focus:underline focus:decoration-2 focus:outline-none"
                >
                  See all about {state.name} →
                </Link>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
