import type { Authority } from "@/types/democracyWorks";
import type { State } from "@/types/State";
import Link from "next/link";

type UsefulLinksProps = {
  authority?: Authority | null;
  state: State;
};

export function UsefulLinks({ authority, state }: UsefulLinksProps) {
  return (
    <ul className="body-md list-disc space-y-3">
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
  );
}
