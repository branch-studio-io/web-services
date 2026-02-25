import { IDReqsBlock } from "@/components/vr-rules/IDReqsBlock";
import { extractIdRequirements } from "@/utils/idRequirements";

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
  return (
    <div>
      <h2 className="header-3 border-ink mb-2 border-b pb-2 font-bold">
        {title}
      </h2>
      <div className="space-y-4">
        <IDReqsBlock
          bullets={bullets}
          fullText={fullText}
          linkUrl={url}
          linkLabel={label}
        />
      </div>
    </div>
  );
}
