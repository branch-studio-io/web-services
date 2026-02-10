import logoWhiteSvg from "@/assets/logo-white.svg";
import BackToTopButton from "@/components/BackToTopButton";
import Container from "@/components/Container";
import { TCC_URL } from "@/utils/globals";
import Image from "next/image";
import Link from "next/link";

const siteNav = [
  {
    name: "Register",
    href: "https://the-civics-center-2023.squarespace.com/register",
  },
  {
    name: "Donate",
    href: `${TCC_URL}/donate`,
  },
  { name: "Contact", href: `${TCC_URL}/contact-us` },
];

export default function Footer() {
  return (
    <footer>
      <BackToTopButton />

      <Container className="bg-ink text-white" innerClassName="py-8">
        <div className="flex flex-row items-start justify-between gap-10 py-12">
          <div className="flex flex-col gap-x-8 gap-y-4 md:flex-row">
            <Link
              href={process.env["NODE_ENV"] === "production" ? TCC_URL : "/"}
            >
              <Image
                alt="The Civics Center logo"
                src={logoWhiteSvg}
                width={132}
                height={53}
                className="mr-auto h-[72px] w-auto"
              />
            </Link>
            <div className="flex max-w-[240px] flex-col gap-4">
              <p className="body-md">
                1000 N Alameda St, Suite 240
                <br />
                Los Angeles, CA 90012
              </p>

              <p className="body-sm leading-5.5">
                The Civics Center is a project of{" "}
                <Link
                  href="https://communitypartners.org"
                  className="text-cc-yellow"
                  target="_blank"
                >
                  Community Partners
                </Link>
                . © 2025
                <br />
                <Link
                  className="text-cc-yellow"
                  href="https://drive.google.com/file/d/1hbBbaL4uNUw7c3_gdXKiJdDfu_1XWShi/view"
                  target="_blank"
                >
                  Terms of Service and Privacy Policy
                </Link>
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-x-8 gap-y-4 self-start md:flex-row">
            <nav aria-label="Footer site map">
              <ul className="flex flex-col gap-x-8 gap-y-4 lg:flex-row">
                {siteNav.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-cc-yellow text-xl leading-8 font-bold"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </Container>
    </footer>
  );
}
