import BreadCrumb from "@/components/BreadCrumb";
import { LinkButton } from "@/components/Button";
import Container from "@/components/Container";
import { StateStamp } from "@/components/vr-rules/StateStamp";
import { StateVRRules } from "@/components/vr-rules/StateVRRules";
import { StateVRSummary } from "@/components/vr-rules/StateVRSummary";
import authoritiesJson from "@/data/authorities.json";
import electionsJson from "@/data/elections.json";
import statePopsJson from "@/data/state-pops.json";
import statesJson from "@/data/states.json";
import type { Authority, Election } from "@/types/democracyWorks";
import type { State } from "@/types/state";
import type { StatePop } from "@/types/statePop";
import { parseStateCode } from "@/utils/democracyWorksUtils";
import { notFound } from "next/navigation";

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
    <>
      <Container className="bg-sand">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-20 lg:flex-row">
            <aside className="w-320px flex justify-center">
              <StateStamp state={state} />
            </aside>

            <div className="flex flex-col gap-6">
              <BreadCrumb
                paths={[
                  { name: "All States", href: "/vr-rules" },
                  {
                    name: `${state.name} Requirements`,
                    href: `/vr-rules/${state.slug}`,
                  },
                ]}
              />
              <StateVRSummary
                state={state}
                authority={authority}
                statePop={statePop}
                stateElections={stateElections}
              />

              <div className="flex gap-4">
                <LinkButton variant="primary" href="#">
                  Register to Vote
                </LinkButton>
                <LinkButton variant="primary" href="#">
                  Learn to Lead
                </LinkButton>
                <LinkButton variant="primary" href="#">
                  Share on Social
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Container className="bg-white">
        <StateVRRules
          state={state}
          authority={authority}
          statePop={statePop}
          stateElections={stateElections}
        />
      </Container>
    </>
  );
}
