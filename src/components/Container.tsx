import { MAX_WIDTH } from "@/utils/globals";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type ContainerProps = {
  className?: string;
  innerClassName?: string;
  children?: ReactNode;
};

export default function Container({
  className,
  children,
  innerClassName,
}: ContainerProps) {
  return (
    <div className={twMerge("bg-white", className)}>
      <div
        className={twMerge("mx-auto px-6 py-16 lg:px-8", innerClassName)}
        style={{ maxWidth: MAX_WIDTH }}
      >
        {children}
      </div>
    </div>
  );
}
