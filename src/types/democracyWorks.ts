export type Registration = {
  online: {
    supported: boolean;
    instructions: string;
    url: string | null;
  };
};

export type YouthRegistration = {
  supported: "byAge" | "byElection";
  eligibilityAge: string | null;
  eligibilityByElectionType: string | null;
  methods: string;
  onlineInstructions: string | null;
  inPersonInstructions: string | null;
  byMailInstructions: string | null;
  eligibilityByElection: {
    date: string | null;
  };
};

export type Authority = {
  ocdId: string;
  registration: Registration;
  youthRegistration: YouthRegistration;
};
