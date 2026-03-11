import { State } from "@/types/state";
import { StateIcon } from "../StateIcon";

type StateStampProps = {
  state: State;
};

export function StateStamp({ state }: StateStampProps) {
  return (
    <div className="mb-10 flex w-fit shrink-0 rotate-[-4.57deg] flex-col gap-5 overflow-visible">
      <h1 className="header-3 mx-auto max-w-[304px] text-center font-extrabold">
        Pre-18 voter registration in
      </h1>
      <h2 className="header-3 bg-teal-intense px-[40px] py-[30px] text-center font-extrabold whitespace-nowrap text-white drop-shadow-lg drop-shadow-black/40">
        {state.code === "DC" ? "D.C." : state.name}
      </h2>
      <div className="hidden flex-row items-center justify-center overflow-visible lg:flex">
        <StateIcon
          code={state.code}
          width={300}
          height={200}
          className="text-yellow filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
        />
      </div>
    </div>
  );
}
