import Container from "@/components/Container";
import NationalPreregMap from "@/components/NationalPreregMap";
import statePopsJson from "@/data/state-pops.json";
import statesJson from "@/data/states.json";
import youthRegistrationsJson from "@/data/youth-registrations.json";
import type { StateYouthRegistration } from "@/types/democracyWorks";
import type { State } from "@/types/state";
import type { StatePop } from "@/types/statePop";
import { THREE_COLOR_DIVERGENT_SCALE } from "@/utils/globals";

const states = statesJson as State[];
const statePops = statePopsJson as StatePop[];
const youthRegistrations = youthRegistrationsJson as StateYouthRegistration[];

const categories = [
  {
    label: "50% of U.S. teens:",
    description: "Preregistration starts at age 16 or earlier",
  },
  {
    label: "20% more teens:",
    description:
      "States that allow at least one year to register before the first election but do not start at age 16",
  },
  {
    label: "Remaining 30%:",
    description:
      "States with shorter preregistration periods; most have time to register in senior year.",
  },
] as const;

export default async function VRRulesPage() {
  return (
    <Container className="bg-sand">
      <div className="mx-auto space-y-10">
        <div className="mx-auto flex flex-col gap-20 lg:flex-row">
          <div>
            <h1 className="header-2 my-4">State Requirements</h1>
            <p className="font-sans text-lg">
              Explore our interactive map to state-by-state voting requirements:
            </p>
          </div>
          <div>
            <h2 className="header-4 font-bold">Pre-18 Registration Laws</h2>
            <ul className="body-md mt-6 list-none space-y-3">
              {categories.map(({ label, description }, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span
                    className={`h-[22px] w-[22px] shrink-0`}
                    aria-hidden
                    style={{
                      backgroundColor: THREE_COLOR_DIVERGENT_SCALE[index],
                    }}
                  />
                  <span>
                    <strong>{label}</strong> <em>{description}</em>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full">
          <NationalPreregMap
            width={800}
            height={500}
            className="mx-auto h-full w-full"
            youthRegistrations={youthRegistrations}
            states={states}
            statePops={statePops}
            stateRoute="/vr-rules"
          />
        </div>
      </div>
    </Container>
  );
}
