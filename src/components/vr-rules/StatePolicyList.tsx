import type { StatePolicy } from "@/types/StatePolicies";

type StatePolicyListProps = {
  policies: StatePolicy[];
};

export function StatePolicyList({ policies }: StatePolicyListProps) {
  return (
    <div className="space-y-4">
      {policies.map((policy) => (
        <div key={policy.label}>
          <h4 className="header-6 font-extrabold">{policy.label}</h4>
          <p className="body-md">{policy.description}</p>
        </div>
      ))}
    </div>
  );
}
