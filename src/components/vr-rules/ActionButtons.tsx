import { LinkButton } from "@/components/Button";
import { TCC_URL } from "@/utils/globals";

export const ActionButtons = () => {
  return (
    <>
      <LinkButton
        variant="primary"
        href={`${TCC_URL}/hellovoters`}
        className="whitespace-nowrap box-shadow-md"
      >
        Register to Vote
      </LinkButton>
      <LinkButton
        variant="primary"
        href={`${TCC_URL}/run-a-voter-registration-drive`}
        className="whitespace-nowrap box-shadow-md"
      >
        Learn to Lead
      </LinkButton>
      <LinkButton variant="primary" href="#" className="whitespace-nowrap box-shadow-md">
        Share this Info
      </LinkButton>
    </>
  );
};
