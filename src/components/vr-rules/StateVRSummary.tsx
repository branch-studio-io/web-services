import type { Authority, Election } from "@/types/democracyWorks";
import type { State } from "@/types/state";
import type { StatePop } from "@/types/statePop";
import {
  studentImpactText,
  voterEligibilityText,
} from "@/utils/democracyWorksUtils";
import numeral from "numeral";

function concatByMailInstructions(authority: Authority): string | null {
  const byMail = authority.registration.byMail;
  if (!byMail) return null;
  const parts = [
    byMail.idInstructions,
    byMail.signatureInstructions,
    byMail.citizenInstructions,
    byMail.newVoterInstructions,
  ].filter((s): s is string => Boolean(s?.trim()));
  return parts.length > 0 ? parts.join("<br>") : null;
}

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
  stateElections,
}: StateVRSummaryProps) {
  const impactText = studentImpactText(authority.youthRegistration);
  return (
    <div>
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
      <svg
        width={754}
        height={260}
        viewBox="0 0 754 260"
        xmlns="http://www.w3.org/2000/svg"
        className="mt-8 rounded-lg"
        aria-label="Bar Chart Placeholder"
      >
        <rect x="0" y="0" width="754" height="260" fill="#fff" />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="32"
          fill="#160d62"
          fontWeight="bold"
        >
          TODO: Bar Chart
        </text>
      </svg>

      {statePop && (
        <h2 className="header-4 border-b border-gray-300 py-5 font-extrabold">
          In {state.name} {numeral(statePop.pop18 ?? 0).format("0,0")} residents
          turn 18 every year.
        </h2>
      )}
    </div>
  );
}
