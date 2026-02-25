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
      <h2 className="header-3 mb-2 font-bold">Upcoming Elections:</h2>
      <ul className="body-md list-disc space-y-3 pl-6">
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
    </div>
  );
}
