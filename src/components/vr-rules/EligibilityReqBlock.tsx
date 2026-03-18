import { Authority } from "@/types/democracyWorks";

type EligibilityReqBlockProps = {
  title: string;
  authority: Authority;
};

export function EligibilityReqBlock({
  title,
  authority,
}: EligibilityReqBlockProps) {

  return (
    <div>
      <details className="group">
        <summary className="header-5 mb-2 flex cursor-pointer list-none items-center gap-2 font-extrabold [&::-webkit-details-marker]:hidden">
          <span
            className="transition-transform select-none group-open:rotate-90"
            aria-hidden
          >
            ▸
          </span>
          {title}
        </summary>
        <div className="space-y-4 border-t border-gray-300 pt-2">TODO</div>
      </details>
    </div>
  );
}
