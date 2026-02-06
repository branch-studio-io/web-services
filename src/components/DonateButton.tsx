"use client";

import { usePopoverHover } from "@/hooks/usePopoverHover";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import clsx from "clsx";
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
                "flex items-center gap-2 rounded-md bg-cc-red px-[22.4px] py-4 text-[16px] font-semibold uppercase text-white",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2",
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
              <div className="relative rounded-[22px] bg-ink-450 px-6 py-[22px] text-white shadow-lg min-w-[258px]">
                {/* Speech bubble tail pointing up */}
                <div className="absolute -top-3 right-6 h-0 w-0 border-l-[14px] border-r-[14px] border-b-[14px] border-transparent border-b-ink-450" />

                <div className="flex flex-col gap-2">
                  {menuItems.map((item, index) =>
                    item.type === "link" ? (
                      <a
                        href={item.href}
                        key={index}
                        className={clsx(
                          "text-right text-[16px] font-semibold leading-[20.8px]",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-450 rounded",
                        )}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <div
                        key={index}
                        className="text-right text-[12.8px] text-white/80 font-semibold tracking-[0.64px] transition-colors leading-[20.8px]"
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
