export type StatePolicy = {
  label: string;
  description: string;
};

export type StatePolicies = {
  state: string;
  policies: StatePolicy[];
};
