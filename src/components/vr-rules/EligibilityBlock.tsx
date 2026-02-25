import type { Authority } from "@/types/democracyWorks";
import {
  studentImpactText,
  voterEligibilityText,
} from "@/utils/democracyWorksUtils";

type EligibilityBlockProps = {
  authority: Authority;
};

export function EligibilityBlock({ authority }: EligibilityBlockProps) {
  const impactText = studentImpactText(authority.youthRegistration);
  return (
    <div>
      <h2 className="header-3 mb-2 font-bold">You can register to vote if:</h2>
      <div className="space-y-4">
        <p className="body-md">
          {voterEligibilityText(authority.youthRegistration)}
        </p>
        {impactText && (
          <p className="body-md font-semibold">
            <em>
              That means {impactText} can register to vote in your high school
              today.
            </em>
          </p>
        )}
      </div>
    </div>
  );
}
