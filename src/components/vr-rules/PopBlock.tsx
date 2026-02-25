import type { StatePop } from "@/types/statePop";
import numeral from "numeral";

type PopBlockProps = {
  statePop: StatePop;
};

export function PopBlock({ statePop }: PopBlockProps) {
  return (
    <div>
      <h2 className="header-3 mb-2 font-bold">
        Residents turning 18 this year:
      </h2>
      <p className="body-md">{numeral(statePop.pop18 ?? 0).format("0,0")}</p>
    </div>
  );
}
