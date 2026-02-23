export enum PreregStatus {
  AGE_16_OR_EARLIER = "AGE_16_OR_EARLIER",
  AT_LEAST_ONE_YEAR = "AT_LEAST_ONE_YEAR",
  LESS_THAN_ONE_YEAR = "LESS_THAN_ONE_YEAR",
  NOT_AVAILABLE = "NOT_AVAILABLE",
}

export type Registration = {
  formUrl: string | null;
  byMail: {
    supported: boolean;
    url: string | null;
    idInstructions: string | null;
    signatureInstructions?: string | null;
    citizenInstructions?: string | null;
    newVoterInstructions?: string | null;
  };
  online: {
    supported: boolean;
    instructions: string;
    url: string | null;
  };
  inPerson: {
    supported: boolean;
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
  url?: string | null;
  /** When present, use for Online Pre-registration link; else fallback to top-level url */
  online?: { url?: string | null };
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
    | "special";
    registration: {
      inPerson: {
        deadline: {
          date: string;
        }
      },
      byMail: {
        deadline: {
          date: string;
        }
      },
      online: {
        deadline: {
          date: string;
        }
      }
    }
};
