import Container from "@/components/Container";
import { THREE_COLOR_DIVERGENT_SCALE } from "@/utils/globals";

const categories = [
  {
    label: "50% of U.S. teens:",
    description: "Preregistration starts at age 16 or earlier",
    color: "bg-red-500",
  },
  {
    label: "20% more teens:",
    description:
      "States that allow at least one year to register before the first election but do not start at age 16",
    color: "bg-green-500",
  },
  {
    label: "50% of U.S. teens:",
    description: "Preregistration starts at age 16 or earlier",
    color: "bg-blue-500",
  },
] as const;

export default function VRRulesPage() {
  return (
    <Container className="bg-sand">
      <div className="mx-auto flex max-w-6xl flex-col gap-20 lg:flex-row">
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
    </Container>
  );
}
