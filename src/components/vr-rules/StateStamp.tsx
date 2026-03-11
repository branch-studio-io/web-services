import { State } from "@/types/state";

type StateStampProps = {
  state: State;
};

export function StateStamp({ state }: StateStampProps) {
  return (
    <div className="mb-10 flex w-fit shrink-0 rotate-[-4.57deg] flex-col gap-5">
      <h1 className="header-3 mx-auto max-w-[304px] text-center font-extrabold">
        Pre-18 voter registration in
      </h1>
      <h2 className="header-3 bg-teal-intense px-[40px] py-[30px] text-center font-extrabold whitespace-nowrap text-white drop-shadow-lg drop-shadow-black/40">
        {state.code === "DC" ? "D.C." : state.name}
      </h2>
    </div>
  );
}
