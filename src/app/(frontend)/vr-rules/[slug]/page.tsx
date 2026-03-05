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
        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-[375px_1fr] lg:gap-x-16 lg:gap-y-4">
          <div className="flex justify-center lg:justify-start">
            <StateStamp state={state} />
          </div>
          <div className="">
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
          </div>
          <div className="flex items-center justify-end">
            <h3 className="header-4 font-extrabold">Next Steps! →</h3>
          </div>
          <div className="flex items-center justify-end lg:justify-start">
            <div className="flex flex-col gap-4 lg:flex-row">
              <LinkButton
                variant="primary"
                href="#"
                className="whitespace-nowrap"
              >
                Register to Vote
              </LinkButton>
              <LinkButton
                variant="primary"
                href="#"
                className="whitespace-nowrap"
              >
                Learn to Lead
              </LinkButton>
              <LinkButton
                variant="primary"
                href="#"
                className="whitespace-nowrap"
              >
                Share on Social
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
      <Container className="bg-white">
        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-[375px_1fr] lg:gap-x-16 lg:gap-y-4">
          <div className="flex flex-col items-center justify-center gap-6">
            <h3 className="header-4 font-extrabold">Next Steps!</h3>
            <div>
              <div className="flex w-fit flex-col gap-4">
                <LinkButton
                  variant="primary"
                  href="#"
                  className="whitespace-nowrap"
                >
                  Register to Vote
                </LinkButton>
                <LinkButton
                  variant="primary"
                  href="#"
                  className="whitespace-nowrap"
                >
                  Learn to Lead
                </LinkButton>
                <LinkButton
                  variant="primary"
                  href="#"
                  className="whitespace-nowrap"
                >
                  Share on Social
                </LinkButton>
              </div>
            </div>
          </div>
          <div className="">
            <StateVRRules
              state={state}
              authority={authority}
              statePop={statePop}
              stateElections={stateElections}
            />
          </div>
        </div>
      </Container>
    </>
  );
}
