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
          {authority && authority.registration.online?.supported && (
            <OnlineRegistrationBlock authority={authority} />
          )}
          {authority && authority.registration.byMail?.supported && (
            <ByMailRegistrationBlock authority={authority} />
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

type OnlineRegistrationBlockProps = {
  authority: Authority;
};

function OnlineRegistrationBlock({ authority }: OnlineRegistrationBlockProps) {
  const { bullets, fullText } = extractIdRequirements(
    authority.registration.online?.instructions ?? null,
  );
  return (
    <div>
      <h2 className="header-3 border-ink mb-2 border-b pb-2 font-bold">
        Online Registration:
      </h2>
      <div className="space-y-4">
        <IDRequirementsBlock bullets={bullets} fullText={fullText} />
        {authority.registration.online?.url && (
          <Link
            href={authority.registration.online?.url}
            className="body-md font-semibold hover:underline hover:underline-offset-2"
            target="_blank"
          >
            Register Online &gt;
          </Link>
        )}
      </div>
    </div>
  );
}

type ByMailRegistrationBlockProps = {
  authority: Authority;
};

function ByMailRegistrationBlock({ authority }: ByMailRegistrationBlockProps) {
  const { bullets, fullText } = extractIdRequirements(
    authority.registration.byMail?.idInstructions ?? null,
  );
  return (
    <div>
      <h2 className="header-3 border-ink mb-2 border-b pb-2 font-bold">
        By Mail Registration:
      </h2>
      <div className="space-y-4">
        <IDRequirementsBlock bullets={bullets} fullText={fullText} />
        {authority.registration.byMail?.url && (
          <Link
            href={authority.registration.byMail?.url}
            className="body-md font-semibold hover:underline hover:underline-offset-2"
            target="_blank"
          >
            Register By Mail &gt;
          </Link>
        )}
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
