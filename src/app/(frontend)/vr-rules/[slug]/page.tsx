import BreadCrumb from "@/components/BreadCrumb";
import Container from "@/components/Container";
import { DemocracyWorksText } from "@/components/DemocracyWorksText";
import authoritiesJson from "@/data/authorities.json";
import electionsJson from "@/data/elections.json";
import statePopsJson from "@/data/state-pops.json";
import statesJson from "@/data/states.json";
import type { Authority, Election } from "@/types/democracyWorks";
import type { State } from "@/types/state";
import type { StatePop } from "@/types/statePop";
import {
  formatElectionDate,
  parseStateCode,
  voterEligibilityText,
} from "@/utils/democracyWorksUtils";
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
          {authority && <OnlineInstructionsBlock authority={authority} />}
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
      <h2 className="header-4 mb-2 font-bold">
        Residents turning 18 this year:
      </h2>
      <p className="body-md">{numeral(statePop.pop18 ?? 0).format("0,0")}</p>
    </div>
  );
}

type AuthortyBlockProps = {
  authority: Authority;
};

function EligibilityBlock({ authority }: AuthortyBlockProps) {
  return (
    <div>
      <h2 className="header-4 mb-2 font-bold">You can register to vote if:</h2>
      <div className="space-y-4">
        <p className="body-md">
          {voterEligibilityText(authority.youthRegistration)}
        </p>
        <p className="body-md font-semibold">
          <em>
            That means juniors, seniors, and X percent of sophmores... can
            register to vote in your HS today.
          </em>
        </p>
      </div>
    </div>
  );
}

function OnlineInstructionsBlock({ authority }: AuthortyBlockProps) {
  return (
    <div>
      <h2 className="header-4 mb-2 font-bold">Online Instructions:</h2>
      <div className="space-y-6">
        {authority.youthRegistration.methods?.includes("online") ? (
          <DemocracyWorksText
            text={authority.youthRegistration.onlineInstructions ?? ""}
            renderers={{
              paragraph: (children) => (
                <p className="body-md">{children}</p>
              ),
            }}
          />
        ) : (
          <p className="body-md">
            Online registration is not supported in this state.
          </p>
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
      <h2 className="header-4 mb-2 font-bold">Upcoming Elections:</h2>
      <ul className="body-md list-none space-y-3">
        {elections && elections.length > 0 ? (
          elections.map((election, index) => (
            <li key={index} className="flex items-start gap-3">
              {formatElectionDate(election.date)} - {election.description}
            </li>
          ))
        ) : (
          <p className="body-md">No upcoming elections found for this state.</p>
        )}
      </ul>
    </div>
  );
}
