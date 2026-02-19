import { DemocracyWorksText } from "@/components/DemocracyWorksText";
import {
  type IdRequirementType,
  ID_REQUIREMENTS,
} from "@/utils/idRequirements";

type IDRequirementsBlockProps = {
  fullText: string | null;
  bullets: IdRequirementType[];
};

export function IDRequirementsBlock({
  fullText,
  bullets,
}: IDRequirementsBlockProps) {
  const text = fullText?.trim() ?? "";
  if (!text) return null;

  return (
    <div className="space-y-4">
      {bullets.length > 0 && (
        <div>
          <h3 className="body-md mb-2 font-bold">ID Requirements</h3>
          <ul className="body-md list-disc space-y-1 pl-6">
            {bullets.map((bullet, index) => {
              const { label, definition } = ID_REQUIREMENTS[bullet];
              return (
                <li key={index}>
                  <span className="font-bold">{label}: </span>
                  {definition}
                </li>
              );
            })}
          </ul>
        </div>
      )}
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
        <div className="mt-2">
          <DemocracyWorksText
            text={text}
            renderers={{
              paragraph: (children) => (
                <p className="body-md mb-4">{children}</p>
              ),
            }}
          />
        </div>
      </details>
    </div>
  );
}
