import BreadCrumb from "@/components/BreadCrumb";
import Container from "@/components/Container";
import configPromise from "@payload-config";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function StateVRRulesPage({ params }: PageProps) {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });
  const { docs } = await payload.find({
    collection: "states",
    where: { slug: { equals: slug } },
    limit: 1,
  });
  const state = docs[0];
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
