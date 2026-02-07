import Container from "@/components/Container";
import Link from "next/link";

export default async function HomePage() {
  return (
    <Container className="bg-sand">
      <div>
        <h1 className="header-1">Home Page</h1>
        <Link href="/vr-rules">VR Rules</Link>
      </div>
    </Container>
  );
}
