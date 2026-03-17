import ballotBoxImg from "@/assets/ballot-box.png";
import { State } from "@/types/state";
import Image from "next/image";
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
      <h2 className="header-3 bg-teal-intense box-shadow-md px-[40px] py-[22px] text-center font-extrabold whitespace-nowrap text-white">
        {state.code === "DC" ? "D.C." : state.name}

        <Image
          className="-mt-3 ml-3 inline-block"
          src={ballotBoxImg}
          alt="Ballot Box"
          width={38}
          height={38}
        />
      </h2>
      <div className="hidden flex-row items-center justify-center overflow-visible lg:flex">
        <StateIcon
          code={state.code}
          width={300}
          height={200}
          className="text-yellow drop-shadow-[0_5px_2px_rgba(138,124,53,0.9)] filter"
        />
      </div>
    </div>
  );
}
