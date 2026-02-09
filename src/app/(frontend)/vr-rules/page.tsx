import Container from "@/components/Container";
import NationalPreregMap from "@/components/NationalPreregMap";
import { getYouthRegistration } from "@/utils/democracyWorkApi";
import { THREE_COLOR_DIVERGENT_SCALE } from "@/utils/globals";
import configPromise from "@payload-config";
import { getPayload } from "payload";

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
      "Remaining 30%: States with shorter preregistration periods; most have time to register in senior year.",
  },
] as const;

export default async function VRRulesPage() {
  const payload = await getPayload({ config: configPromise });
  const { docs: states } = await payload.find({
    collection: "states",
    limit: 100,
    sort: "name",
  });

  const youthRegistration = await getYouthRegistration();

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
            youthRegistration={youthRegistration}
            states={states}
            stateRoute="/vr-rules"
          />
        </div>
      </div>
    </Container>
  );
}
