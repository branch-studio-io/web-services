export type StateYouthRegistration = {
  state: string;
  youthRegistration: YouthRegistration;
};

export type YouthRegistration = {
  url: string | null;
  formUrl: string | null;
  supported: "byAge" | "byElection";
  methods: string;
  onlineInstructions: string | null;
  inPersonInstructions: string;
  byMailInstructions: string;
  eligibilityAge: string | null;
  statusAvailability: string | null;
  eligibilityByElectionType: string | null;
  eligibilityByElection: {
    date: string | null;
    primaryVotingSupported: boolean;
    futureLocalElectionApplicable: boolean | null;
  };
};
