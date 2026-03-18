import type { Election } from "@/types/democracyWorks";
import {
  formatDeadlineSuffix,
  formatElectionDate,
  getRegistrationDeadline,
} from "@/utils/democracyWorksUtils";

type ElectionsListProps = {
  elections: Election[] | null;
};

export function ElectionsList({ elections }: ElectionsListProps) {
  return (
    <ul className="body-md list-disc space-y-3">
      {elections && elections.length > 0 ? (
        elections.map((election, index) => {
          const deadline = getRegistrationDeadline(election);
          return (
            <li key={index}>
              {formatElectionDate(election.date)} - {election.description}
              {deadline && <> (Register by {formatDeadlineSuffix(deadline)})</>}
            </li>
          );
        })
      ) : (
        <li className="body-md">No upcoming elections found for this state.</li>
      )}
    </ul>
  );
}
