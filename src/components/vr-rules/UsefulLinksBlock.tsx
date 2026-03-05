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
      <h3 className="header-4 mb-2 border-b border-gray-300 pb-2 font-extrabold">
        Useful Links:
      </h3>
      <ul className="body-md list-disc space-y-3 pl-6">
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
    </div>
  );
}
