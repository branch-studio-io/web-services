import statesJson from "@/data/states.json";
import type { State } from "@/types/state";
import type { StatePop } from "@/types/statePop";
import { BigQuery } from "@google-cloud/bigquery";
import "dotenv/config";
import { getEnvKey } from "./utils";

const states = statesJson as State[];

const LOCATION = getEnvKey("GCLOUD_LOCATION");
const PROJECT_ID = getEnvKey("GCLOUD_PROJECT_ID");
const PRIVATE_KEY_ID = getEnvKey("GCLOUD_PRIVATE_KEY_ID");
const PRIVATE_KEY = getEnvKey("GCLOUD_PRIVATE_KEY");
const CLIENT_EMAIL = getEnvKey("GCLOUD_CLIENT_EMAIL");
const CLIENT_ID = getEnvKey("GCLOUD_CLIENT_ID");

const bigquery = new BigQuery({
  projectId: PROJECT_ID,
  credentials: {
    type: "service_account",
    project_id: PROJECT_ID,
    private_key_id: PRIVATE_KEY_ID,
    private_key: PRIVATE_KEY,
    client_email: CLIENT_EMAIL,
    client_id: CLIENT_ID,
  },
});

export async function getStatePopulations(): Promise<StatePop[]> {
  const [rows] = await bigquery.query(
    "SELECT STATE AS STATE_FIPS, NAME AS STATE_NAME, POPESTIMATE2023 AS POPULATION FROM `tcc-research.census_pop_est.pop_est_syasex_race5_us_states_2023` WHERE SEX = 0 AND ORIGIN = 0 AND RACE = 1 AND AGE = 18 ORDER BY NAME;",
    {
      location: LOCATION,
    },
  );

  const statePop: StatePop[] = rows.map((row) => ({
    code: states.find((state) => state.name === row.STATE_NAME)?.code || "",
    pop18: row.POPULATION,
  }));

  return statePop;
}
