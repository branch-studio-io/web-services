"use client";

import type { Authority, Election } from "@/types/democracyWorks";
import type { State } from "@/types/state";
import type { StatePop } from "@/types/statePop";
import { getPreregStatus } from "@/utils/democracyWorkApi";
import {
  formatElectionDate,
  parseStateCode,
  PREREG_STATUS_BORDER_COLORS,
  PREREG_STATUS_COLORS,
  voterEligibilityText,
} from "@/utils/democracyWorksUtils";
import { extractIdRequirements } from "@/utils/idRequirements";
import { CheckIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
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

  const registrationByState = useMemo(
    () =>
      new Map(
        authorities.map((a) => [
          getStateCodeFromOcdId(a.ocdId),
          a.registration,
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
    <div>
      {/* Mobile: card layout */}
      <div className="border-sand-600 border lg:hidden">
        {states.map((state, index) => {
          const youthReg = youthRegByState.get(state.code);
          const registration = registrationByState.get(state.code);
          const statePop = statePopsByFips.get(state.fips);
          const nextElection = nextElectionByState.get(state.code);

          const onlineInstructions =
            registration?.online?.instructions ??
            youthReg?.onlineInstructions ??
            null;
          const { bullets } = extractIdRequirements(onlineInstructions);
          const requiresDmvId = bullets.includes("STATE_DL_OR_ID");

          const rowBg = index % 2 === 0 ? "bg-white" : "bg-sand-300";

          return (
            <article
              key={state.fips}
              className={`border-sand-600 border-b p-4 last:border-b-0 ${rowBg}`}
            >
              <h3 className="mb-4 font-semibold text-gray-950">
                <Link
                  href={`/vr-rules/${state.slug}`}
                  className="inline-flex items-center gap-2 hover:underline focus:underline focus:outline-none"
                >
                  <span
                    className="size-4 shrink-0 rounded-xs border"
                    style={{
                      backgroundColor:
                        PREREG_STATUS_COLORS[getPreregStatus(youthReg)],
                      borderColor:
                        PREREG_STATUS_BORDER_COLORS[getPreregStatus(youthReg)],
                    }}
                    aria-hidden
                  />
                  {state.name}
                  <ChevronRightIcon
                    className="size-4 shrink-0"
                    aria-hidden
                  />
                </Link>
              </h3>
              <dl className="space-y-3 text-sm text-gray-950">
                <div>
                  <dt className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-gray-950">
                    You can register to vote if
                  </dt>
                  <dd>
                    {youthReg ? voterEligibilityText(youthReg) : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-gray-950">
                    Next Election
                  </dt>
                  <dd>
                    {nextElection
                      ? `${formatElectionDate(nextElection.date)} — ${nextElection.description}`
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-gray-950">
                    Turning 18 this year
                  </dt>
                  <dd className="tabular-nums">
                    {numeral(statePop?.pop18 ?? 0).format("0,0")}
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">
                    By Mail, Online, DMV Issued ID
                  </dt>
                  <dd className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <span className="flex items-center gap-1.5">
                      {registration?.byMail.supported ? (
                        <CheckIcon
                          className="size-5 shrink-0 text-green-600"
                          aria-label="By mail registration supported"
                        />
                      ) : (
                        <span className="inline-block size-5 shrink-0 text-center text-gray-400">—</span>
                      )}
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-950">By Mail</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      {registration?.online.supported ? (
                        <CheckIcon
                          className="size-5 shrink-0 text-green-600"
                          aria-label="Online registration supported"
                        />
                      ) : (
                        <span className="inline-block size-5 shrink-0 text-center text-gray-400">—</span>
                      )}
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-950">Online</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      {requiresDmvId ? (
                        <CheckIcon
                          className="size-5 shrink-0 text-green-600"
                          aria-label="DMV-issued ID required for online registration"
                        />
                      ) : (
                        <span className="inline-block size-5 shrink-0 text-center text-gray-400">—</span>
                      )}
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-950">
                        DMV Issued ID{" "}
                        <Link
                          href="#dmv-issued-id"
                          className="font-normal normal-case tracking-normal hover:underline focus:underline focus:outline-none"
                          aria-label="View DMV-issued ID explanation"
                        >
                          *
                        </Link>
                      </span>
                    </span>
                  </dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>

      {/* Desktop: table layout */}
      <div className="hidden overflow-x-auto lg:block">
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
            <th
              className="border-sand-600 border-r border-b px-4 py-1.5 text-center text-xs font-semibold tracking-wide text-gray-950 uppercase"
              scope="col"
            >
              By Mail
            </th>
            <th
              className="border-sand-600 border-r border-b px-4 py-1.5 text-center text-xs font-semibold tracking-wide text-gray-950 uppercase"
              scope="col"
            >
              Online
            </th>
            <th
              className="border-sand-600 border-r border-b px-4 py-1.5 text-center text-xs font-semibold tracking-wide text-gray-950 uppercase"
              scope="col"
            >
              DMV Issued ID{" "}
              <Link
                href="#dmv-issued-id"
                className="hover:underline focus:underline focus:outline-none"
                aria-label="View DMV-issued ID explanation"
              >
                *
              </Link>
            </th>
          </tr>
        </thead>
        <tbody>
          {states.map((state, index) => {
            const youthReg = youthRegByState.get(state.code);
            const registration = registrationByState.get(state.code);
            const statePop = statePopsByFips.get(state.fips);
            const nextElection = nextElectionByState.get(state.code);
            const rowBg = index % 2 === 0 ? "bg-white" : "bg-sand-300";

            const onlineInstructions =
              registration?.online?.instructions ??
              youthReg?.onlineInstructions ??
              null;
            const { bullets } = extractIdRequirements(onlineInstructions);
            const requiresDmvId = bullets.includes("STATE_DL_OR_ID");

            return (
              <tr key={state.fips} className={rowBg}>
                <td className="border-sand-600 border-r px-4 py-1.5 text-sm font-medium text-gray-950">
                  <div className="flex items-center gap-2">
                    <div
                      className="size-4 shrink-0 rounded-xs border"
                      style={{
                        backgroundColor:
                          PREREG_STATUS_COLORS[getPreregStatus(youthReg)],
                        borderColor:
                          PREREG_STATUS_BORDER_COLORS[getPreregStatus(youthReg)],
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
                <td className="border-sand-600 border-r px-4 py-1.5 text-center text-sm text-gray-950">
                  {registration?.byMail.supported && (
                    <CheckIcon
                      className="mx-auto size-5 text-green-600"
                      aria-label="By mail registration supported"
                    />
                  )}
                </td>
                <td className="border-sand-600 border-r px-4 py-1.5 text-center text-sm text-gray-950">
                  {registration?.online.supported && (
                    <CheckIcon
                      className="mx-auto size-5 text-green-600"
                      aria-label="Online registration supported"
                    />
                  )}
                </td>
                <td className="border-sand-600 border-r px-4 py-1.5 text-center text-sm text-gray-950">
                  {requiresDmvId && (
                    <CheckIcon
                      className="mx-auto size-5 text-green-600"
                      aria-label="DMV-issued ID required for online registration"
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      <div
        id="dmv-issued-id"
        className="mt-4 max-w-prose scroll-mt-4 text-sm text-gray-950"
      >
        * DMV-issued ID required to register to vote online. Eligible citizens
        can print out and mail in a voter registration application without
        DMV-issued ID. Check your state’s form for details. For assistance
        learning what forms of ID you can use to register and vote, and for help
        obtaining a valid form of ID, visit{" "}
        <a
          href="https://voteriders.org"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          VoteRiders.org
        </a>
        .
      </div>
    </div>
  );
}
