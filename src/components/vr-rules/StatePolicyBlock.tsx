import type { StatePolicy } from "@/types/statePolicies";

type StatePolocyBlockProps = {
  title: string;
  policies: StatePolicy[];
};

export function StatePolicyBlock({ title, policies }: StatePolocyBlockProps) {
  return (
    <div>
      <details className="group">
        <summary className="header-4 mb-2 flex cursor-pointer list-none items-center gap-2 font-extrabold [&::-webkit-details-marker]:hidden">
          <span
            className="transition-transform select-none group-open:rotate-90"
            aria-hidden
          >
            ▸
          </span>
          {title}
        </summary>
        <div className="font-lora space-y-4 border-t border-gray-300 pt-2">
          {policies.map((policy) => (
            <div key={policy.label}>
              <h3 className="header-5 font-extrabold">{policy.label}</h3>
              <p className="body-base">{policy.description}</p>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
