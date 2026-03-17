import type { Authority } from "@/types/democracyWorks";
import type { State } from "@/types/state";
import Link from "next/link";

type UsefulLinksBlockProps = {
  authority?: Authority | null;
  state: State;
};

export function UsefulLinksBlock({ authority, state }: UsefulLinksBlockProps) {
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
          Useful Links:
        </summary>
        <ul className="body-md list-disc space-y-3 border-t border-gray-300 pt-2 pl-6">
          <li>
            <Link
              href={`https://fairelectionscenter.org/voter-registration-drive-guides/${state.slug}/`}
              className="underline underline-offset-2"
              target="_blank"
            >
              Conducting a Voter Registration Drive in {state.name}
            </Link>{" "}
            from the Fair Elections Center
          </li>
          {authority?.registration.formUrl && (
            <li>
              <Link
                href={authority.registration.formUrl}
                className="underline underline-offset-2"
                target="_blank"
              >
                Paper Registration Form
              </Link>
            </li>
          )}
        </ul>
      </details>
    </div>
  );
}
