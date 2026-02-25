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
      <h3 className="body-md mb-2 font-bold">{title}</h3>
      <ul className="body-md list-disc space-y-1 pl-6">
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

type RegInstructionsBlockProps = {
  title: string;
  regInstructions: string | null;
  preRegInstructions: string | null;
  url?: string | null;
  label?: string | null;
};

export function RegInstructionsBlock({
  title,
  regInstructions,
  preRegInstructions,
}: RegInstructionsBlockProps) {
  const regBullets = extractIdRequirements(regInstructions);
  const preRegBullets = extractIdRequirements(preRegInstructions);

  const combinedBullets = Array.from(
    new Set([...regBullets, ...preRegBullets]),
  ).sort((a, b) => ID_REQUIREMENTS[a].order - ID_REQUIREMENTS[b].order);

  const regText = regInstructions?.trim() ?? "";
  const preRegText = preRegInstructions?.trim() ?? "";

  return (
    <div>
      <h2 className="header-3 border-ink mb-2 border-b pb-2 font-bold">
        {title}
      </h2>
      <div className="space-y-4">
        <IdRequirementsList title="ID Requirements" bullets={combinedBullets} />

        {regText || preRegText ? (
          <>
            <details className="group">
              <summary className="body-md mb-2 flex cursor-pointer list-none items-center gap-2 font-bold [&::-webkit-details-marker]:hidden">
                <span
                  className="transition-transform select-none group-open:rotate-90"
                  aria-hidden
                >
                  ▸
                </span>
                Full Details
              </summary>
              <div className="mt-6 space-y-4">
                <h3 className="body-md mb-2 font-bold">
                  Registration Instructions
                </h3>
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

                <h3 className="body-md mb-2 font-bold">
                  Pre-Registration Instructions
                </h3>
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
            </details>
          </>
        ) : null}
      </div>
    </div>
  );
}
