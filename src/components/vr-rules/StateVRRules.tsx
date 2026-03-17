import { ElectionsBlock } from "@/components/vr-rules/ElectionsBlock";
import { RegInstructionsBlock } from "@/components/vr-rules/RegInstructionsBlock";
import { UsefulLinksBlock } from "@/components/vr-rules/UsefulLinksBlock";
import { VoteRidersBlock } from "@/components/vr-rules/VoteRidersBlock";
import type { Authority, Election } from "@/types/democracyWorks";
import type { State } from "@/types/state";
import type { StatePolicy } from "@/types/statePolicies";
import { StatePolicyBlock } from "./StatePolicyBlock";

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
  stateElections: Election[];
  statePolicies: StatePolicy[];
};

export function StateVRRules({
  state,
  authority,
  stateElections,
  statePolicies,
}: StateVRRulesProps) {
  return (
    <div className="space-y-8">
      <h3 className="header-4 mt-4 font-extrabold">
        More Details on {state.name}
      </h3>
      <ElectionsBlock elections={stateElections} />
      <UsefulLinksBlock state={state} authority={authority} />
      {authority && authority.registration.online?.supported && (
        <RegInstructionsBlock
          title="Registration Online:"
          regInstructions={authority.registration.online?.instructions ?? null}
          preRegInstructions={
            authority.youthRegistration.onlineInstructions ?? null
          }
        />
      )}
      {authority && authority.registration.byMail?.supported && (
        <RegInstructionsBlock
          title="Registration by Mail:"
          regInstructions={concatByMailInstructions(authority) ?? null}
          preRegInstructions={
            authority.youthRegistration.byMailInstructions ?? null
          }
        />
      )}
      {statePolicies.length > 0 && (
        <StatePolicyBlock
          title="High School VR Requirements:"
          policies={statePolicies}
        />
      )}
      <VoteRidersBlock />
    </div>
  );
}
