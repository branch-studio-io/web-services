import { DemocracyWorksText } from "@/components/DemocracyWorksText";
import {
  type IdRequirementType,
  ID_REQUIREMENTS,
  extractIdRequirements,
} from "@/utils/idRequirements";

type IdRequirementsListProps = {
  title: string;
  bullets: IdRequirementType[];
};

function IdRequirementsList({ title, bullets }: IdRequirementsListProps) {
  if (bullets.length === 0) return null;
  return (
    <div>
      <h4 className="header-6 font-extrabold">{title}</h4>
      <ul className="body-md mt-2 list-disc space-y-1 pl-6">
        {bullets.map((bullet, index) => {
          const { label: bulletLabel, definition } = ID_REQUIREMENTS[bullet];
          return (
            <li key={index}>
              <span className="font-bold">{bulletLabel}: </span>
              {definition}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type RegInstructionsProps = {
  regInstructions: string | null;
  preRegInstructions: string | null;
  url?: string | null;
  label?: string | null;
};

export function RegInstructions({
  regInstructions,
  preRegInstructions,
}: RegInstructionsProps) {
  const regBullets = extractIdRequirements(regInstructions);
  const preRegBullets = extractIdRequirements(preRegInstructions);

  const combinedBullets = Array.from(
    new Set([...regBullets, ...preRegBullets]),
  ).sort((a, b) => ID_REQUIREMENTS[a].order - ID_REQUIREMENTS[b].order);

  const regText = regInstructions?.trim() ?? "";
  const preRegText = preRegInstructions?.trim() ?? "";

  return (
    <div className="space-y-4">
      <IdRequirementsList title="ID Requirements" bullets={combinedBullets} />

      {regText || preRegText ? (
        <div className="mt-6 space-y-4">
          <h4 className="header-6 font-extrabold">Registration Instructions</h4>
          {regText && (
            <DemocracyWorksText
              text={regText}
              renderers={{
                paragraph: (children) => (
                  <p className="body-md mb-4">{children}</p>
                ),
              }}
            />
          )}

          <h4 className="header-6 font-extrabold">
            Pre-Registration Instructions
          </h4>
          {preRegText && (
            <DemocracyWorksText
              text={preRegText}
              renderers={{
                paragraph: (children) => (
                  <p className="body-md mb-4">{children}</p>
                ),
              }}
            />
          )}
        </div>
      ) : null}
    </div>
  );
}
