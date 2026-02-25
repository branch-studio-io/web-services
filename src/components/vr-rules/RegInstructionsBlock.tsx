import { DemocracyWorksText } from "@/components/DemocracyWorksText";
import {
  type IdRequirementType,
  ID_REQUIREMENTS,
  extractIdRequirements,
} from "@/utils/idRequirements";
import Link from "next/link";

type RegInstructionsBlockProps = {
  title: string;
  instructions: string | null;
  url?: string | null;
  label?: string | null;
};

export function RegInstructionsBlock({
  title,
  instructions,
  url,
  label,
}: RegInstructionsBlockProps) {
  const { bullets, fullText } = extractIdRequirements(instructions);
  const text = fullText?.trim() ?? "";
  const hasLink = url && label;

  return (
    <div>
      <h2 className="header-3 border-ink mb-2 border-b pb-2 font-bold">
        {title}
      </h2>
      <div className="space-y-4">
        {text || hasLink ? (
          <>
            {bullets.length > 0 && (
              <div>
                <h3 className="body-md mb-2 font-bold">ID Requirements</h3>
                <ul className="body-md list-disc space-y-1 pl-6">
                  {bullets.map((bullet: IdRequirementType, index: number) => {
                    const { label: bulletLabel, definition } =
                      ID_REQUIREMENTS[bullet];
                    return (
                      <li key={index}>
                        <span className="font-bold">{bulletLabel}: </span>
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
                      href={url!}
                      className="underline underline-offset-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {label}
                    </Link>
                  </p>
                )}
              </div>
            </details>
          </>
        ) : null}
      </div>
    </div>
  );
}
