import BreadCrumb from "@/components/BreadCrumb";
import Container from "@/components/Container";
import { IDRequirementsBlock } from "@/components/IDRequirementsBlock";
import authoritiesJson from "@/data/authorities.json";
import electionsJson from "@/data/elections.json";
import statePopsJson from "@/data/state-pops.json";
import statesJson from "@/data/states.json";
import type { Authority, Election } from "@/types/democracyWorks";
import type { State } from "@/types/state";
import type { StatePop } from "@/types/statePop";
import {
  formatDeadlineSuffix,
  formatElectionDate,
  getRegistrationDeadline,
  parseStateCode,
  studentImpactText,
  voterEligibilityText,
} from "@/utils/democracyWorksUtils";
import { extractIdRequirements } from "@/utils/idRequirements";

function concatByMailInstructions(authority: Authority): string | null {
  const byMail = authority.registration.byMail;
  if (!byMail) return null;
  const parts = [
    byMail.idInstructions,
    byMail.signatureInstructions,
    byMail.citizenInstructions,
    byMail.newVoterInstructions,
  ].filter((s): s is string => Boolean(s?.trim()));
  return parts.length > 0 ? parts.join("<br>") : null;
}
import Link from "next/link";
import { notFound } from "next/navigation";
import numeral from "numeral";

const states = statesJson as State[];
const statePops = statePopsJson as StatePop[];
const authorities = authoritiesJson as Authority[];
const elections = electionsJson as Election[];

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return states.map((state) => ({
    slug: state.slug,
  }));
}

export default async function StateVRRulesPage({ params }: PageProps) {
  const { slug } = await params;
  const state = states.find((s) => s.slug === slug);
  if (!state) {
    notFound();
  }
  const authority = authorities.find(
    (a) => parseStateCode(a.ocdId) === state.code,
  );

  const statePop = statePops.find((sp) => sp.fips === state.fips);
  const stateElections = elections.filter(
    (e) => parseStateCode(e.ocdId) === state.code,
  );

  return (
    <Container className="bg-sand">
      <div className="mx-auto max-w-3xl">
        <BreadCrumb
          paths={[
            { name: "All States", href: "/vr-rules" },
            {
              name: `${state.name} Voter Registration Rules`,
              href: `/vr-rules/${state.slug}`,
            },
          ]}
        />
        <div className="space-y-8">
          <h1 className="header-2 mt-4">{state.name} Requirements</h1>
          {statePop && <PopBlock statePop={statePop} />}
          {authority && <EligibilityBlock authority={authority} />}
          <ElectionsBlock elections={stateElections} />
          <UsefulLinksBlock state={state} authority={authority} />
          {authority && authority.youthRegistration.onlineInstructions && (
            <RegistrationInstructionsBlock
              title="Online Pre-registration:"
              instructions={authority.youthRegistration.onlineInstructions}
            />
          )}
          {authority && authority.registration.online?.supported && (
            <RegistrationInstructionsBlock
              title="Online Registration:"
              instructions={authority.registration.online?.instructions ?? null}
            />
          )}
          {authority && authority.youthRegistration.byMailInstructions && (
            <RegistrationInstructionsBlock
              title="Youth By Mail Pre-registration:"
              instructions={authority.youthRegistration.byMailInstructions}
            />
          )}
          {authority && authority.registration.byMail?.supported && (
            <RegistrationInstructionsBlock
              title="By Mail Registration:"
              instructions={concatByMailInstructions(authority)}
            />
          )}
        </div>
      </div>
    </Container>
  );
}

type PopBlockProps = {
  statePop: StatePop;
};

function PopBlock({ statePop }: PopBlockProps) {
  return (
    <div>
      <h2 className="header-3 mb-2 font-bold">
        Residents turning 18 this year:
      </h2>
      <p className="body-md">{numeral(statePop.pop18 ?? 0).format("0,0")}</p>
    </div>
  );
}

type EligibilityBlockProps = {
  authority: Authority;
};

function EligibilityBlock({ authority }: EligibilityBlockProps) {
  const impactText = studentImpactText(authority.youthRegistration);
  return (
    <div>
      <h2 className="header-3 mb-2 font-bold">You can register to vote if:</h2>
      <div className="space-y-4">
        <p className="body-md">
          {voterEligibilityText(authority.youthRegistration)}
        </p>
        {impactText && (
          <p className="body-md font-semibold">
            <em>
              That means {impactText} can register to vote in your high school
              today.
            </em>
          </p>
        )}
      </div>
    </div>
  );
}

type RegistrationInstructionsBlockProps = {
  title: string;
  instructions: string | null;
};

function RegistrationInstructionsBlock({
  title,
  instructions,
}: RegistrationInstructionsBlockProps) {
  const { bullets, fullText } = extractIdRequirements(instructions);
  return (
    <div>
      <h2 className="header-3 border-ink mb-2 border-b pb-2 font-bold">
        {title}
      </h2>
      <div className="space-y-4">
        <IDRequirementsBlock bullets={bullets} fullText={fullText} />
      </div>
    </div>
  );
}

type ElectionsBlockProps = {
  elections: Election[] | null;
};

function ElectionsBlock({ elections }: ElectionsBlockProps) {
  return (
    <div>
      <h2 className="header-3 mb-2 font-bold">Upcoming Elections:</h2>
      <ul className="body-md list-disc space-y-3 pl-6">
        {elections && elections.length > 0 ? (
          elections.map((election, index) => {
            const deadline = getRegistrationDeadline(election);
            return (
              <li key={index}>
                {formatElectionDate(election.date)} - {election.description}
                {deadline && (
                  <> (Register by {formatDeadlineSuffix(deadline)})</>
                )}
              </li>
            );
          })
        ) : (
          <li className="body-md">
            No upcoming elections found for this state.
          </li>
        )}
      </ul>
    </div>
  );
}

type UsefulLinksBlockProps = {
  authority: Authority;
  state: State;
};

function UsefulLinksBlock({ authority, state }: UsefulLinksBlockProps) {
  return (
    <div>
      <h2 className="header-3 mb-2 font-bold">Useful Links:</h2>
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
        <li>
          <Link
            href={authority.registration.formUrl ?? ""}
            className="underline underline-offset-2"
            target="_blank"
          >
            Paper Registration Form
          </Link>
        </li>
      </ul>
    </div>
  );
}
