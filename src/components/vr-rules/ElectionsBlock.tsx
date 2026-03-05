import type { Election } from "@/types/democracyWorks";
import {
  formatDeadlineSuffix,
  formatElectionDate,
  getRegistrationDeadline,
} from "@/utils/democracyWorksUtils";

type ElectionsBlockProps = {
  elections: Election[] | null;
};

export function ElectionsBlock({ elections }: ElectionsBlockProps) {
  return (
    <div>
      <details className="group" open>
        <summary className="header-4 mb-2 flex cursor-pointer list-none items-center gap-2 font-extrabold [&::-webkit-details-marker]:hidden">
          <span
            className="transition-transform select-none group-open:rotate-90"
            aria-hidden
          >
            ▸
          </span>
          Upcoming Elections:
        </summary>
        <ul className="body-md list-disc space-y-3 border-t border-gray-300 pt-2 pl-6">
          {elections && elections.length > 0 ? (
            elections.map((election, index) => {
              const deadline = getRegistrationDeadline(election);
              return (
                <li key={index}>
                  {formatElectionDate(election.date)} - {election.description}
                  {deadline && (
                    <> (Register by {formatDeadlineSuffix(deadline)})</>
                  )}
                </li>
              );
            })
          ) : (
            <li className="body-md">
              No upcoming elections found for this state.
            </li>
          )}
        </ul>
      </details>
    </div>
  );
}
