import mortarboardImg from "@/assets/mortarboard.png";
import BreadCrumb from "@/components/BreadCrumb";
import { LinkButton } from "@/components/Button";
import Container from "@/components/Container";
import { ActionButtons } from "@/components/vr-rules/ActionButtons";
import { StateStamp } from "@/components/vr-rules/StateStamp";
import { StateVRRules } from "@/components/vr-rules/StateVRRules";
import { StateVRSummary } from "@/components/vr-rules/StateVRSummary";
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
import { TCC_URL } from "@/utils/globals";
import Image from "next/image";
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
      <Container className="bg-beige">
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
        </div>
      </Container>

      <Container className="bg-yellow-light" innerClassName="pt-6 pb-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[375px_1fr] lg:gap-x-16 lg:gap-y-4">
          <div className=""></div>
          <div className="flex flex-col gap-3">
            <h3 className="header-4 font-extrabold">
              High school students can help one another get ready to{" "}
              <span className="whitespace-nowrap">
                vote.
                <Image
                  className="-mt-1 ml-1.5 inline-block"
                  src={mortarboardImg}
                  alt="Mortarboard"
                  width={32}
                  height={32}
                />
              </span>
            </h3>
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

      <Container className="bg-beige">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[375px_1fr] lg:gap-x-16">
          <div className="hidden lg:flex"></div>
          <div>
            <h3 className="header-4 font-extrabold">
              {state.name} high school educators:
            </h3>
            <p className="body-md">
              Support your students' voter registration effort with our free
              toolkit.
            </p>
            <div className="mt-6">
              <LinkButton
                variant="primary"
                href={`${TCC_URL}/toolkits-by-state`}
                className="whitespace-nowrap"
              >
                Download Toolkit
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
