import clsx from "clsx";
import { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type ButtonSize = "medium" | "large";
type ButtonVariant = "primary" | "secondary" | "tertiary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  shadow?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export function Button({
  size = "medium",
  variant = "primary",
  shadow = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={twMerge(getButtonClasses(variant, size, shadow), className)}
      {...props}
    >
      {children}
    </button>
  );
}

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
  shadow?: boolean;
  target?: string;
};

export function LinkButton({
  variant = "primary",
  size = "medium",
  shadow = false,
  target,
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <a
      className={twMerge(getButtonClasses(variant, size, shadow), className)}
      {...props}
      {...(target ? { target: target, rel: "noopener" } : {})}
    >
      {children}
    </a>
  );
}

export function getButtonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  shadow: boolean,
) {
  return clsx(
    "cursor-pointer rounded-full leading-none font-semibold text-center",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2",
    size === "large" ? "text-lg" : "text-base",
    shadow && "shadow-button",
    variant === "primary"
      ? [
          size === "medium" ? "px-[20px] py-[10px] " : "px-[40px] py-[16px]",
          "bg-navy hover:bg-yellow hover:text-navy active:bg-yellow/80 active:text-navy text-white",
        ]
      : [
          size === "medium" ? "px-[18px] py-[9px]" : "px-[38px] py-[15px]",
          "text-navy border-navy hover:bg-yellow active:bg-yellow/80 border-[2px] bg-white",
        ],
  );
}
