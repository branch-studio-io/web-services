import type { Authority, Election } from "@/types/democracyWorks";
import type { State } from "@/types/state";
import type { StatePop } from "@/types/statePop";
import {
  studentImpactText,
  voterEligibilityText,
} from "@/utils/democracyWorksUtils";
import numeral from "numeral";

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
  return (
    <div>
      <h2 className="flex flex-row items-center gap-2 border-b border-gray-300 py-5">
        <span className="header-4 inline-block font-extrabold">
          {state.name} has
        </span>
        <div className="bg-cc-teal header-3 inline-block px-4 py-3 font-extrabold text-white drop-shadow-md drop-shadow-black/40">
          12,345
        </div>
        <span className="header-4 inline-block font-extrabold">
          unregistered 18yos.
        </span>
      </h2>

      {authority && (
        <h2 className="header-4 border-b border-gray-300 py-5 font-extrabold">
          You can register to vote if:{" "}
          {voterEligibilityText(authority.youthRegistration)}
        </h2>
      )}
      {impactText && (
        <h2 className="header-4 border-b border-gray-300 py-5 font-extrabold">
          That means {impactText} can register to vote in your high school
          today.
        </h2>
      )}

      {statePop && (
        <h2 className="header-4 border-b border-gray-300 py-5 font-extrabold">
          In {state.name} {numeral(statePop.pop18 ?? 0).format("0,0")} residents
          turn 18 every year.
        </h2>
      )}
    </div>
  );
}
