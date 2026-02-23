import { DemocracyWorksText } from "@/components/DemocracyWorksText";
import {
  type IdRequirementType,
  ID_REQUIREMENTS,
} from "@/utils/idRequirements";
import Link from "next/link";

type IDRequirementsBlockProps = {
  fullText: string | null;
  bullets: IdRequirementType[];
  /** Optional link to show in Full Details section */
  linkUrl?: string | null;
  linkLabel?: string | null;
};

export function IDRequirementsBlock({
  fullText,
  bullets,
  linkUrl,
  linkLabel,
}: IDRequirementsBlockProps) {
  const text = fullText?.trim() ?? "";
  const hasLink = linkUrl && linkLabel;
  if (!text && !hasLink) return null;

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
        <div className="mt-2 space-y-4">
          {text && (
            <DemocracyWorksText
              text={text}
              renderers={{
                paragraph: (children) => (
                  <p className="body-md mb-4">{children}</p>
                ),
              }}
            />
          )}
          {hasLink && (
            <p className="body-md">
              <Link
                href={linkUrl}
                className="underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                {linkLabel}
              </Link>
            </p>
          )}
        </div>
      </details>
    </div>
  );
}
