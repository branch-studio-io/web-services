"use client";

import { ChevronRightIcon } from "@heroicons/react/16/solid";
import type { Authority, Election } from "@/types/democracyWorks";
import type { State } from "@/types/state";
import type { StatePop } from "@/types/statePop";
import { getPreregStatus } from "@/utils/democracyWorkApi";
import {
  formatElectionDate,
  parseStateCode,
  PREREG_STATUS_COLORS,
  voterEligibilityText,
} from "@/utils/democracyWorksUtils";
import Link from "next/link";
import numeral from "numeral";
import { useMemo } from "react";

type Props = {
  states: State[];
  authorities: Authority[];
  statePops: StatePop[];
  elections: Election[];
};

const getStateCodeFromOcdId = (ocdId: string): string => {
  if (ocdId.includes("district:dc")) return "DC";
  return parseStateCode(ocdId);
};

const getOcdIdMatchesState = (ocdId: string, stateCode: string): boolean => {
  if (stateCode === "DC") return ocdId.includes("district:dc");
  return ocdId.includes(`state:${stateCode.toLowerCase()}`);
};

export default function PreregTable({
  states,
  authorities,
  statePops,
  elections,
}: Props) {
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

  const statePopsByFips = useMemo(
    () => new Map(statePops.map((sp) => [sp.fips, sp])),
    [statePops],
  );

  const nextElectionByState = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    const map = new Map<string, Election>();
    for (const state of states) {
      const matching = elections
        .filter(
          (e) => getOcdIdMatchesState(e.ocdId, state.code) && e.date >= today,
        )
        .sort((a, b) => (a.date < b.date ? -1 : 1));

      const next = matching[0];
      if (next) map.set(state.code, next);
    }
    return map;
  }, [states, elections]);

  return (
    <div className="overflow-x-auto">
      <table className="border-sand-600 w-full min-w-[640px] border-collapse border">
        <thead>
          <tr className="bg-sand-300">
            <th
              className="border-sand-600 border-r border-b px-4 py-1.5 text-left text-xs font-semibold tracking-wide text-gray-950 uppercase"
              scope="col"
            >
              State
            </th>
            <th
              className="border-sand-600 border-r border-b px-4 py-1.5 text-left text-xs font-semibold tracking-wide text-gray-950 uppercase"
              scope="col"
            >
              You can register to vote if
            </th>
            <th
              className="border-sand-600 border-r border-b px-4 py-1.5 text-left text-xs font-semibold tracking-wide text-gray-950 uppercase"
              scope="col"
            >
              Next Election
            </th>
            <th
              className="border-sand-600 border-r border-b px-4 py-1.5 text-right text-xs font-semibold tracking-wide text-gray-950 uppercase"
              scope="col"
            >
              Turning 18 this year
            </th>
          </tr>
        </thead>
        <tbody>
          {states.map((state, index) => {
            const youthReg = youthRegByState.get(state.code);
            const statePop = statePopsByFips.get(state.fips);
            const nextElection = nextElectionByState.get(state.code);
            const rowBg = index % 2 === 0 ? "bg-white" : "bg-sand-300";

            return (
              <tr key={state.fips} className={rowBg}>
                <td className="border-sand-600 border-r px-4 py-1.5 text-sm font-medium text-gray-950">
                  <div className="flex items-center gap-2">
                    <div
                      className="size-4 shrink-0 rounded-xs"
                      style={{
                        backgroundColor:
                          PREREG_STATUS_COLORS[getPreregStatus(youthReg)],
                      }}
                      aria-hidden
                    />
                    <Link
                      href={`/vr-rules/${state.slug}`}
                      className="inline-flex items-center gap-1 hover:underline focus:underline focus:outline-none"
                    >
                      {state.name}
                      <ChevronRightIcon
                        className="size-4 shrink-0"
                        aria-hidden
                      />
                    </Link>
                  </div>
                </td>
                <td className="border-sand-600 border-r px-4 py-1.5 text-sm text-gray-950">
                  {youthReg ? voterEligibilityText(youthReg) : "—"}
                </td>
                <td className="border-sand-600 border-r px-4 py-1.5 text-sm text-gray-950">
                  {nextElection
                    ? `${formatElectionDate(nextElection.date)} — ${nextElection.description}`
                    : "—"}
                </td>
                <td className="border-sand-600 border-r px-4 py-1.5 text-right text-sm text-gray-950 tabular-nums">
                  {numeral(statePop?.pop18 ?? 0).format("0,0")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
