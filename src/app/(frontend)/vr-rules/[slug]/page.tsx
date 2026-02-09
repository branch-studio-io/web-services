import BreadCrumb from "@/components/BreadCrumb";
import Container from "@/components/Container";
import statesJson from "@/data/states.json";
import type { State } from "@/types/state";
import { notFound } from "next/navigation";

const states = statesJson as State[];

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function StateVRRulesPage({ params }: PageProps) {
  const { slug } = await params;
  const state = states.find((state) => state.slug === slug);
  if (!state) {
    notFound();
  }
  return (
    <Container className="bg-sand">
      <BreadCrumb
        paths={[
          { name: "All States", href: "/vr-rules" },
          {
            name: `${state.name} Voter Registration Rules`,
            href: `/vr-rules/${state.slug}`,
          },
        ]}
      />
      <h1 className="header-2 my-4">{state.name} Requirements</h1>
    </Container>
  );
}
