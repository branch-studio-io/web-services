import megaphone from "@/assets/megaphone.png";
import Image from "next/image";

type Props = {
  text: string;
  icon?: boolean;
};

export default function AnnouncePill({ text, icon = false }: Props) {
  return (
    <div className="bg-yellow text-navy flex w-fit flex-row items-center justify-center gap-2 rounded-md px-7 py-4 text-lg font-extrabold">
      <div>{text}</div>
      {icon && (
        <Image
          className="block"
          src={megaphone}
          alt="Megaphone"
          width={30}
          height={30}
        />
      )}
    </div>
  );
}
