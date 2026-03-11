import BreadCrumb from "@/components/BreadCrumb";
import Container from "@/components/Container";
import { StateStamp } from "@/components/vr-rules/StateStamp";
import { StateVRRules } from "@/components/vr-rules/StateVRRules";
import { StateVRSummary } from "@/components/vr-rules/StateVRSummary";
import { ActionButtons } from "@/components/vr-rules/ActionButtons";
import authoritiesJson from "@/data/authorities.json";
import electionsJson from "@/data/elections.json";
import statePoliciesJson from "@/data/state-policies.json";
import statePopsJson from "@/data/state-pops.json";
import statesJson from "@/data/states.json";
import type { Authority, Election } from "@/types/democracyWorks";
import type { State } from "@/types/state";
import type { StatePolicies } from "@/types/statePolicies";
import type { StatePop } from "@/types/statePop";
import { parseStateCode } from "@/utils/democracyWorksUtils";
import { notFound } from "next/navigation";

const states = statesJson as State[];
const statePops = statePopsJson as StatePop[];
const authorities = authoritiesJson as Authority[];
const elections = electionsJson as Election[];
const statePolicies = statePoliciesJson as StatePolicies[];

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

  const policies =
    statePolicies.find((sp) => sp.state === state.code)?.policies ?? [];

  return (
    <>
      <Container className="bg-beige" innerClassName="">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[375px_1fr] lg:gap-x-16 lg:gap-y-4">
          <div className="flex justify-center lg:mt-10">
            <StateStamp state={state} />
          </div>
          <div className="pt-6">
            <BreadCrumb
              paths={[
                { name: "All States", href: "/vr-rules" },
                {
                  name: `${state.name}`,
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
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <h3 className="header-4 font-extrabold">Next Steps! →</h3>
          </div>
          <div className="flex items-center justify-center lg:justify-start">
            <div className="flex flex-col gap-4 lg:flex-row">
              <ActionButtons />
            </div>
          </div>
        </div>
      </Container>
      <Container className="bg-white">
        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-[375px_1fr] lg:gap-x-16 lg:gap-y-4">
          <div className="hidden flex-col items-center justify-center gap-6 lg:flex">
            <h3 className="header-4 font-extrabold">Next Steps!</h3>
            <div>
              <div className="flex w-fit flex-col gap-4">
                <ActionButtons />
              </div>
            </div>
          </div>
          <div className="">
            <StateVRRules
              state={state}
              authority={authority}
              stateElections={stateElections}
              statePolicies={policies}
            />
          </div>
        </div>
      </Container>
    </>
  );
}
