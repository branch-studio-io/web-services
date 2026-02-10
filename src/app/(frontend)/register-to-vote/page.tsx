import Container from "@/components/Container";
import Link from "next/link";

export default async function DataPortalPage() {
  return (
    <Container>
      <section className="space-y-4">
        <h1 className="header-1">Register to Vote</h1>
        <p className="body-md">
          <strong>TO DO:</strong> Move the register to vote from{" "}
          <Link
            href="https://www.thecivicscenter.org/register-to-vote"
            className="font-bold hover:underline hover:underline-offset-4"
          >
            /register-to-vote
          </Link>{" "}
          and{" "}
          <Link
            href="https://www.thecivicscenter.org/hellovoters"
            className="font-bold hover:underline hover:underline-offset-4"
          >
            /hellovoters
          </Link>{" "}
          to this route.
        </p>
      </section>
    </Container>
  );
}
