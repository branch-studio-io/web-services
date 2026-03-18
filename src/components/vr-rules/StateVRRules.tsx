import { ElectionsList } from "@/components/vr-rules/ElectionsList";
import { EligibilityRequirments } from "@/components/vr-rules/EligibilityRequirments";
import { StatePolicyList } from "@/components/vr-rules/StatePolicyList";
import { TitleExpandBlock } from "@/components/vr-rules/TitleExpandBlock";
import { UsefulLinks } from "@/components/vr-rules/UsefulLinks";
import { VoteRidersInfo } from "@/components/vr-rules/VoteRidersInfo";
import type { Authority, Election } from "@/types/democracyWorks";
import type { State } from "@/types/State";
import type { StatePolicy } from "@/types/StatePolicies";

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
    <div className="space-y-6">
      <h3 className="header-4 font-extrabold">More Details on {state.name}</h3>
      <TitleExpandBlock title="Upcoming Elections">
        <ElectionsList elections={stateElections} />
      </TitleExpandBlock>

      {authority && (
        <TitleExpandBlock title="Full Eligibility Requirements" open={false}>
          <EligibilityRequirments authority={authority} />
        </TitleExpandBlock>
      )}

      {statePolicies.length > 0 && (
        <TitleExpandBlock title="High School Requirements" open={false}>
          <StatePolicyList policies={statePolicies} />
        </TitleExpandBlock>
      )}
      <TitleExpandBlock title="Assistance Obtaining an ID" open={false}>
        <VoteRidersInfo />
      </TitleExpandBlock>

      <TitleExpandBlock title="More Useful Links" open={false}>
        <UsefulLinks state={state} authority={authority} />
      </TitleExpandBlock>
    </div>
  );
}
