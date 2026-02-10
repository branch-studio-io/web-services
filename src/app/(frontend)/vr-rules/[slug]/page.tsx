import BreadCrumb from "@/components/BreadCrumb";
import Container from "@/components/Container";
import authoritiesJson from "@/data/authorities.json";
import statePopsJson from "@/data/state-pops.json";
import statesJson from "@/data/states.json";
import type { Authority } from "@/types/democracyWorks";
import type { State } from "@/types/state";
import type { StatePop } from "@/types/statePop";
import { voterEligibilityText } from "@/utils/democracyWorksUtils";
import { splitByBreakTags } from "@/utils/utils";
import { notFound } from "next/navigation";
import numeral from "numeral";

const states = statesJson as State[];
const statePops = statePopsJson as StatePop[];
const authorities = authoritiesJson as Authority[];

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
    (a) => a.ocdId.slice(-2).toUpperCase() === state.code,
  );

  const statePop = statePops.find((sp) => sp.fips === state.fips);

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
        {authority.youthRegistration.methods.includes("online") ? (
          <>
            {splitByBreakTags(
              authority.youthRegistration.onlineInstructions ?? "",
            ).map((paragraph, i) => (
              <p key={i} className="body-md">
                {paragraph}
              </p>
            ))}
          </>
        ) : (
          <p className="body-md">
            Online registration is not supported in this state.
          </p>
        )}
      </div>
    </div>
  );
}
