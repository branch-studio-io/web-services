import Link from "next/link";

export function VoteRidersInfo() {
  return (
    <div className="body-md space-y-4">
      <p>
        DMV-issued ID required to register to vote online. Eligible citizens can
        print out and mail in a voter registration application without
        DMV-issued ID. Check your state&apos;s form for details.
      </p>
      <p>
        <Link
          href="https://voteriders.org"
          className="underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          VoteRiders.org
        </Link>{" "}
        — For assistance learning what forms of ID you can use to register and
        vote, and for help obtaining a valid form of ID.
      </p>
    </div>
  );
}
