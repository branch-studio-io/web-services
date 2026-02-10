import Container from "@/components/Container";
import { ArrowRightIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import Link from "next/link";

const routes = [
  {
    href: "/vr-rules",
    label: "State Requirements",
  },
  {
    href: "/data-portal",
    label: "Data Portal",
  },
  {
    href: "/leaderboard",
    label: "Leaderboard",
  },
  {
    href: "/register-to-vote",
    label: "Register to Vote",
  },
];

const highlightColors = [
  "border-cc-teal",
  "border-cc-red",
  "border-cc-evergreen",
  "border-cc-yellow",
  "border-cc-sky-blue",
];

export default async function HomePage() {
  return (
    <Container className="bg-white">
      <section>
        <div className="mx-auto px-4 py-8 sm:py-16 lg:px-6">
          <div className="grid space-y-8 lg:grid-cols-2 lg:gap-12 lg:space-y-0">
            <div className="space-y-2">
              <h2 className="header-1">Web Services</h2>
              <p className="body-md">
                The site contains specific page routes that are not possible to
                create with Squarespace.
              </p>
              <p className="body-sm text-ink-300">
                Source code is available on{" "}
                <Link
                  href="https://github.com/CivicsCenter"
                  className="font-bold hover:underline hover:underline-offset-4"
                >
                  GitHub
                </Link>
                .
              </p>
              <Link
                href="/admin"
                className="text-ink-600 hover:text-ink-700 mt-4 inline-flex items-center text-lg font-medium hover:underline hover:underline-offset-4"
              >
                Update via Admin Panel
                <ChevronRightIcon className="text-ink-600 h-6 w-6" />
              </Link>
            </div>
            <div>
              {routes.map((route, i) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={clsx(
                    highlightColors[i % highlightColors.length],
                    "mb-6 flex items-center justify-between rounded-lg border-l-8 bg-white p-4 shadow hover:bg-gray-50",
                  )}
                >
                  <div>
                    <span className="mb-1 block text-xs font-semibold text-gray-500">
                      {route.href}
                    </span>
                    <span className="text-ink-600 text-xl font-semibold">
                      {route.label}
                    </span>
                  </div>
                  <ArrowRightIcon className="text-ink-600 h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
