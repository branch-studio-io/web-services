import { DemocracyWorksText } from "@/components/DemocracyWorksText";

type IDRequirementsBlockProps = {
  fullText: string | null;
  bullets: string[];
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
          <h3 className="header-4 mb-2 font-bold">ID Requirements</h3>
          <ul className="body-md list-disc space-y-1 pl-6">
            {bullets.map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h3 className="header-4 mb-2 font-bold">Full Details</h3>
        <DemocracyWorksText
          text={text}
          renderers={{
            paragraph: (children) => <p className="body-md">{children}</p>,
          }}
        />
      </div>
    </div>
  );
}
