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
  methods: string | null;
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

export type Election = {
  ocdId: string;
  date: string;
  description: string;
  type:
    | "presidentialPrimary"
    | "state"
    | "stateSenate"
    | "stateHouse"
    | "congressional"
    | "senate"
    | "county"
    | "subCounty"
    | "municipal"
    | "subMunicipal"
    | "school"
    | "special";
};
