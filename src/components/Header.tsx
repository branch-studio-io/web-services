"use client";

import logoSvg from "@/assets/logo.svg";
import { MAX_WIDTH, TCC_URL } from "@/utils/globals";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars2Icon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import { Fragment, useState } from "react";
import DonateButton from "./DonateButton";


const navigation = [
  {
    name: "Register to Vote",
    href: `${TCC_URL}/hellovoters/?tv-r=data`,
    type: "highlighted-link" as const,
  },
  {
    name: "About",
    href: `${TCC_URL}/data-about`,
    type: "link" as const,
  },
  {
    name: "FAQs",
    href: `${TCC_URL}/data-faqs`,
    type: "link" as const,
  },
  {
    name: "Close the Gap",
    href: `${TCC_URL}/close-the-gap`,
    type: "link" as const,
  },
  {
    name: "Donate",
    type: "popup" as const,
    items: [
      {
        href: `${TCC_URL}/donate`,
        label: "Donate Today",
        type: "link" as const,
      },
      {
        label: "OTHER WAYS TO HELP",
        type: "heading" as const,
      },
      {
        href: `${TCC_URL}/donate-check-stock`,
        label: "Donate by Check or Stock",
        type: "link" as const,
      },
      {
        href: `${TCC_URL}/donate-daf`,
        label: "Donor Advised Funds",
        type: "link" as const,
      },
    ],
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-10 bg-white shadow-md">
      <nav
        aria-label="Global"
        className={`mx-auto flex items-center justify-between px-6 py-3 lg:px-8`}
        style={{ maxWidth: MAX_WIDTH }}
      >
        <a href={TCC_URL} className="-m-1.5 p-1.5">
          <span className="sr-only">The Civics Center</span>
          <Image
            alt="The Civics Center Logo"
            src={logoSvg}
            width={132}
            height={53}
            className="h-[53px] w-auto"
          />
        </a>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars2Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden items-center lg:flex lg:gap-x-10">
          {navigation.map((item) =>
            item.type === "link" || item.type === "highlighted-link" ? (
              <a
                key={item.name}
                href={item.href}
                className={clsx("text-base text-[16px] font-semibold", {
                  "text-cc-teal text-[16px] uppercase":
                    item.type === "highlighted-link",
                })}
              >
                {item.name}
              </a>
            ) : (
              <Fragment key={item.name}>
                <DonateButton label={item.name!} menuItems={item.items!} />
              </Fragment>
            ),
          )}
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-0 z-50 overflow-y-auto bg-white p-6 ring-1 ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Image
              alt="The Civics Center Logo"
              src={logoSvg}
              width={132}
              height={53}
              className="h-[53px] w-auto"
            />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-8" />
            </button>
          </div>
          <div className="mt-10 flow-root">
            <div className="text-center">
              <div className="text-ink text-[clamp(1.3rem,4vw,4rem)] leading-[1.24] font-semibold">
                {navigation.map((item) =>
                  item.type === "link" || item.type === "highlighted-link" ? (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block rounded-lg py-2.5 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ) : (
                    item.items
                      ?.filter((item) => item.type === "link")
                      .map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          className="block rounded-lg py-2.5 hover:bg-gray-50"
                        >
                          {item.label}
                        </a>
                      ))
                  ),
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}

// 1.3 - 3rem
