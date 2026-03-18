import headExplodingImg from "@/assets/head-exploding.png";
import sirenImg from "@/assets/siren.png";
import type { Authority, Election } from "@/types/democracyWorks";
import type { State } from "@/types/state";
import type { StatePop } from "@/types/statePop";
import { StateRegRates } from "@/types/stateRegRates";
import {
  studentImpactText,
  voterEligibilityParts,
} from "@/utils/democracyWorksUtils";
import { DATA_URL } from "@/utils/globals";
import Image from "next/image";
import Link from "next/link";
import numeral from "numeral";

type StateVRSummaryProps = {
  state: State;
  authority: Authority | undefined;
  statePop: StatePop | undefined;
  stateElections: Election[];
  stateRegRate: StateRegRates | undefined;
};

export function StateVRSummary({
  state,
  authority,
  statePop,
  stateRegRate,
}: StateVRSummaryProps) {
  const impactText = studentImpactText(authority.youthRegistration);
  const voterEligibility = voterEligibilityParts(authority.youthRegistration);

  const unregistered18 = stateRegRate
    ? (1 - stateRegRate.regRate18) * stateRegRate.pop18
    : undefined;

  return (
    <div>
      <h2 className="border-b border-gray-300 py-5">
        <span className="header-4 mr-3 font-extrabold">{state.name} has</span>
        {unregistered18 ? (
          <Link
            href={`${DATA_URL}/state/${state.code}/#state-registration-rates`}
          >
            <PopButton
              population={
                unregistered18 ? unregistered18 : (statePop?.pop18 ?? 0)
              }
            />
          </Link>
        ) : (
          <PopButton
            population={
              unregistered18 ? unregistered18 : (statePop?.pop18 ?? 0)
            }
          />
        )}
        <span className="header-4 font-extrabold">
          {unregistered18 ? "unregistered 18yos." : "18yos."}
        </span>
      </h2>

      {authority && (
        <h2 className="header-4 border-b border-gray-300 py-5 font-extrabold">
          {state.demonym} can{" "}
          <Image
            className="-mt-2 inline-block"
            src={sirenImg}
            alt="Siren"
            width={32}
            height={32}
          />{" "}
          pre-register before turning{" "}
          <span className="whitespace-nowrap">
            18{" "}
            <Image
              className="-mt-2 inline-block"
              src={sirenImg}
              alt="Siren"
              width={32}
              height={32}
            />
          </span>
        </h2>
      )}
      {impactText && voterEligibility.main && (
        <div className="flex flex-col gap-5 py-5">
          <h2 className="header-4 font-extrabold">
            To register to vote in {state.name}, you must be:{" "}
            {voterEligibility.main}
          </h2>
          <h2 className="header-4 underline-highlight font-extrabold">
            That means {impactText} in your high school can register to vote
            today.
          </h2>
        </div>
      )}
    </div>
  );
}

type PopButtonProps = {
  population: number;
};

function PopButton({ population }: PopButtonProps) {
  return (
    <span className="bg-teal-intense header-3 box-shadow-md mr-3 inline-flex flex-row items-center gap-3 px-[26px] py-[14px] text-white">
      <span className="header-3 font-extrabold">
        {numeral(population).format("0,0")}
      </span>
      <Image
        src={headExplodingImg}
        alt="Head exploding"
        width={32}
        height={32}
      />
    </span>
  );
}
