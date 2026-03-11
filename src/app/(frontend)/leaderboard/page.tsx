import Container from "@/components/Container";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function Page() {
  return (
    <Container>
      <section className="mx-auto max-w-3xl space-y-4">
        <h1 className="header-1">Leaderboard</h1>
        <p className="body-md">
          This site will include the High School Leaderboard, showing how each
          school’s voter registration drives rank nationally and regionally.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center text-lg font-medium hover:underline hover:underline-offset-4"
        >
          <ChevronLeftIcon className="h-6 w-6" />
          Home
        </Link>
      </section>
    </Container>
  );
}
