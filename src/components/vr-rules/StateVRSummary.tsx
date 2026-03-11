import headExplodingImg from "@/assets/head-exploding.png";
import sirenImg from "@/assets/siren.png";
import type { Authority, Election } from "@/types/democracyWorks";
import type { State } from "@/types/state";
import type { StatePop } from "@/types/statePop";
import {
  studentImpactText,
  voterEligibilityText,
} from "@/utils/democracyWorksUtils";
import Image from "next/image";

type StateVRSummaryProps = {
  state: State;
  authority: Authority | undefined;
  statePop: StatePop | undefined;
  stateElections: Election[];
};

export function StateVRSummary({
  state,
  authority,
  statePop,
}: StateVRSummaryProps) {
  const impactText = studentImpactText(authority.youthRegistration);
  const voterEligibility = voterEligibilityText(authority.youthRegistration);
  const eligibilityText = `If ${voterEligibility.charAt(0).toLowerCase()}${voterEligibility.slice(
    1,
  )}`;
  return (
    <div>
      <h2 className="border-b border-gray-300 py-5">
        <span className="header-4 mr-2 font-extrabold">{state.name} has</span>
        <span className="bg-teal-intense header-3 mr-2 inline-flex flex-row items-center gap-3 px-[26px] py-[14px] text-white drop-shadow-md drop-shadow-black/40">
          <span className="header-3 font-extrabold">12,345</span>
          <Image
            src={headExplodingImg}
            alt="Head exploding"
            width={32}
            height={32}
          />
        </span>
        <span className="header-4 font-extrabold">unregistered 18yos.</span>
      </h2>

      {authority && (
        <h2 className="border-b border-gray-300 py-5">
          <span className="header-4 mr-2 font-extrabold">
            {state.name} can pre-register
          </span>
          <span className="bg-teal-intense header-3 mr-2 inline-flex flex-row items-center gap-3 px-[26px] py-[14px] text-white drop-shadow-md drop-shadow-black/40">
            <span className="header-3 font-extrabold">BEFORE turning 18</span>
            <Image src={sirenImg} alt="Siren" width={32} height={32} />
          </span>
          <span className="header-4 font-extrabold">{eligibilityText}</span>
        </h2>
      )}
      {impactText && (
        <h2 className="header-4 underline-highlight border-b border-gray-300 py-5 font-extrabold">
          That means {impactText} in your high school can register to vote
          today.
        </h2>
      )}

      {statePop && (
        <h2 className="header-4 border-b border-gray-300 py-5 font-extrabold">
          High school students can help one another get ready to vote.
        </h2>
      )}
    </div>
  );
}
