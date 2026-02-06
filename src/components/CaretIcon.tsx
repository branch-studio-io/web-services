import { SVGProps } from "react";

type CaretProps = SVGProps<SVGSVGElement>;

export default function CaretIcon({ className, ...props }: CaretProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 22 22"
      strokeLinecap="square"
      strokeLinejoin="miter"
      strokeWidth="1px"
      className={className}
      {...props}
    >
      <path d="M18 7L11 14L4 7" fill="none"></path>
    </svg>
  );
}
