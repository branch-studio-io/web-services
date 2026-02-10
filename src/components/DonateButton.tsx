"use client";

import { usePopoverHover } from "@/hooks/usePopoverHover";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import CaretIcon from "./CaretIcon";

type MenuItem = {
  type: "link" | "heading";
  label: string;
  href?: string;
};

type Props = {
  label: string;
  menuItems: MenuItem[];
};

export default function DonateButton({ label, menuItems }: Props) {
  const { popoverRef, buttonRef } = usePopoverHover();

  return (
    <div className="relative">
      <Popover ref={popoverRef}>
        {({ open }) => (
          <>
            <PopoverButton
              ref={buttonRef}
              className={clsx(
                "bg-cc-red flex items-center gap-2 rounded-md px-[22.4px] py-4 text-[16px] font-semibold text-white uppercase",
                "focus-visible:ring-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "transition-colors duration-200",
              )}
            >
              <span>{label}</span>
              <span className={clsx(open && "rotate-180")}>
                <CaretIcon className="h-4 w-4 stroke-white stroke-[3px]" />
              </span>
            </PopoverButton>
            <PopoverPanel
              transition
              className={clsx(
                "absolute right-0 z-10 mt-[10px]",
                "transition-all duration-200 ease-out",
              )}
            >
              <div className="bg-ink-450 relative min-w-[258px] rounded-[22px] px-6 py-[22px] text-white shadow-lg">
                {/* Speech bubble tail pointing up */}
                <div className="border-b-ink-450 absolute -top-3 right-6 h-0 w-0 border-r-[14px] border-b-[14px] border-l-[14px] border-transparent" />

                <div className="flex flex-col gap-2">
                  {menuItems.map((item, index) =>
                    item.type === "link" ? (
                      <Link
                        href={item.href}
                        key={index}
                        className={clsx(
                          "text-right text-[16px] leading-[20.8px] font-semibold",
                          "focus-visible:ring-offset-ink-450 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2",
                        )}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <div
                        key={index}
                        className="text-right text-[12.8px] leading-[20.8px] font-semibold tracking-[0.64px] text-white/80 transition-colors"
                      >
                        {item.label}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </PopoverPanel>
          </>
        )}
      </Popover>
    </div>
  );
}
