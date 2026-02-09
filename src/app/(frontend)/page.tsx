import Container from "@/components/Container";
import Link from "next/link";

export default async function HomePage() {
  return (
    <Container className="bg-sand">
      <div>
        <h1 className="header-1">Home Page</h1>
        <ul className="mt-4">
          <li>
            <Link className="font-sans text-lg hover:underline" href="/admin">
              Admin Interface
            </Link>
          </li>
          <li>
            <Link
              className="font-sans text-lg hover:underline"
              href="/vr-rules"
            >
              Voter Registration Rules
            </Link>
          </li>
        </ul>
      </div>
    </Container>
  );
}
