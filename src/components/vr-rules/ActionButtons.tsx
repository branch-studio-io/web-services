import { LinkButton } from "@/components/Button";
import { TCC_URL } from "@/utils/globals";
import { ArrowRightIcon } from "@heroicons/react/16/solid";

export const ActionButtons = () => {
  return (
    <>
      <LinkButton
        variant="primary"
        size="large"
        href={`${TCC_URL}/hellovoters`}
        className="box-shadow-md pr-[30px] whitespace-nowrap"
      >
        <span className="flex items-center justify-center gap-2">
          Register to Vote
          <ArrowRightIcon className="h-5 w-5" />
        </span>
      </LinkButton>
      <LinkButton
        variant="primary"
        size="large"
        href={`${TCC_URL}/run-a-voter-registration-drive`}
        className="box-shadow-md pr-[30px] whitespace-nowrap"
      >
        <span className="flex items-center justify-center gap-2">
          Learn to Lead
          <ArrowRightIcon className="h-5 w-5" />
        </span>
      </LinkButton>
      <LinkButton
        variant="primary"
        size="large"
        href="#"
        className="box-shadow-md whitespace-nowrap"
      >
        Share this Info
      </LinkButton>
    </>
  );
};
