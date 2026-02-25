import { ElectionsBlock } from "@/components/vr-rules/ElectionsBlock";
import { EligibilityBlock } from "@/components/vr-rules/EligibilityBlock";
import { PopBlock } from "@/components/vr-rules/PopBlock";
import { RegInstructionsBlock } from "@/components/vr-rules/RegInstructionsBlock";
import { UsefulLinksBlock } from "@/components/vr-rules/UsefulLinksBlock";
import { VoteRidersBlock } from "@/components/vr-rules/VoteRidersBlock";
import type { Authority, Election } from "@/types/democracyWorks";
import type { State } from "@/types/state";
import type { StatePop } from "@/types/statePop";

function concatByMailInstructions(authority: Authority): string | null {
  const byMail = authority.registration.byMail;
  if (!byMail) return null;
  const parts = [
    byMail.idInstructions,
    byMail.signatureInstructions,
    byMail.citizenInstructions,
    byMail.newVoterInstructions,
  ].filter((s): s is string => Boolean(s?.trim()));
  return parts.length > 0 ? parts.join("<br>") : null;
}

type StateVRRulesProps = {
  state: State;
  authority: Authority | undefined;
  statePop: StatePop | undefined;
  stateElections: Election[];
};

export function StateVRRules({
  state,
  authority,
  statePop,
  stateElections,
}: StateVRRulesProps) {
  return (
    <div className="space-y-8">
      <h1 className="header-2 mt-4">{state.name} Requirements</h1>
      {statePop && <PopBlock statePop={statePop} />}
      {authority && <EligibilityBlock authority={authority} />}
      <ElectionsBlock elections={stateElections} />
      <UsefulLinksBlock state={state} authority={authority} />
      {authority && authority.youthRegistration.onlineInstructions && (
        <RegInstructionsBlock
          title="Online Pre-registration:"
          instructions={authority.youthRegistration.onlineInstructions}
          url={
            authority.youthRegistration.url ??
            authority.registration.online?.url ??
            null
          }
          label="Pre-register to vote online"
        />
      )}
      {authority && authority.registration.online?.supported && (
        <RegInstructionsBlock
          title="Online Registration:"
          instructions={authority.registration.online?.instructions ?? null}
          url={authority.registration.online?.url ?? null}
          label="Register to vote online"
        />
      )}
      {authority && authority.youthRegistration.byMailInstructions && (
        <RegInstructionsBlock
          title="Youth By Mail Pre-registration:"
          instructions={authority.youthRegistration.byMailInstructions}
        />
      )}
      {authority && authority.registration.byMail?.supported && (
        <RegInstructionsBlock
          title="By Mail Registration:"
          instructions={concatByMailInstructions(authority)}
        />
      )}
      <VoteRidersBlock />
    </div>
  );
}
