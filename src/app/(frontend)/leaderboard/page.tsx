import Container from "@/components/Container";
import Link from "next/link";

export default async function DataPortalPage() {
  return (
    <Container>
      <section className="space-y-4">
        <h1 className="header-1">Leaderboard</h1>
        <p className="body-md">
          <strong>TO DO:</strong> Move the leaderboard from{" "}
          <Link
            href="https://leaderboard.thecivicscenter.org"
            className="font-bold hover:underline hover:underline-offset-4"
          >
            leaderboard.thecivicscenter.org
          </Link>{" "}
          to this route.
        </p>
      </section>
    </Container>
  );
}
