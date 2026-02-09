import Container from "@/components/Container";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { notFound } from "next/navigation";

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
      <h1 className="header-2 my-4">{state.name}</h1>
    </Container>
  );
}
