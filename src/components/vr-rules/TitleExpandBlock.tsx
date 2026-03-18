import type { ReactNode } from "react";

type TitleExpandBlockProps = {
  title: string;
  children: ReactNode;
  open?: boolean;
};

export function TitleExpandBlock({
  title,
  children,
  open = true,
}: TitleExpandBlockProps) {
  return (
    <div>
      <details className="group" open={open}>
        <summary className="header-5 mb-2 flex cursor-pointer list-none items-center gap-2 font-extrabold [&::-webkit-details-marker]:hidden">
          <span
            className="transition-transform select-none group-open:rotate-90"
            aria-hidden
          >
            ▸
          </span>
          {title}
        </summary>
        <div className="mb-10 border-t border-gray-300 pt-4 pl-6">
          {children}
        </div>
      </details>
    </div>
  );
}
