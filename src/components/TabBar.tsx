"use client";
import { Tab } from "@/types/Tab";
import clsx from "clsx";

type TabBarProps = {
  selectedId: string;
  tabs: Tab[];
  onClick: (id: string) => void;
};

export default function TabBar({ tabs, selectedId, onClick }: TabBarProps) {
  return (
    <div className={clsx("border-b border-gray-200")}>
      <nav
        aria-label="Tabs"
        className="flex justify-center gap-x-4 xl:justify-start"
      >
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => onClick(tab.id)}
            aria-current={tab.id === selectedId ? "page" : undefined}
            className={clsx(
              tab.id === selectedId
                ? "border-ink text-ink"
                : "text-ink/40 border-transparent hover:border-neutral-300",
              "cursor-pointer border-b-4 py-[3px] text-base font-semibold whitespace-nowrap",
            )}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
}
