import type { StatePop } from "@/types/statePop";
import { BigQuery } from "@google-cloud/bigquery";
import "dotenv/config";
import { getEnvKey } from "./utils";

const LOCATION = getEnvKey("GCLOUD_LOCATION");
const PROJECT_ID = getEnvKey("GCLOUD_PROJECT_ID");
const PRIVATE_KEY_ID = getEnvKey("GCLOUD_PRIVATE_KEY_ID");
const PRIVATE_KEY = getEnvKey("GCLOUD_PRIVATE_KEY");
const CLIENT_EMAIL = getEnvKey("GCLOUD_CLIENT_EMAIL");
const CLIENT_ID = getEnvKey("GCLOUD_CLIENT_ID");

const privateKey = PRIVATE_KEY.replace(/^"|"$/g, "") // remove accidental wrapping quotes
  .replace(/\\n/g, "\n"); // turn literal \n into real newlines

const bigquery = new BigQuery({
  projectId: PROJECT_ID,
  credentials: {
    type: "service_account",
    project_id: PROJECT_ID,
    private_key_id: PRIVATE_KEY_ID,
    private_key: privateKey,
    client_email: CLIENT_EMAIL,
    client_id: CLIENT_ID,
  },
});

export async function getStatePopulations(): Promise<StatePop[]> {
  const [rows] = await bigquery.query(
    "SELECT STATE_FIPS, ((EST_15_TO_17_YO / 3.0) + ((EST_18_AND_OVER - EST_21_AND_OVER) / 3.0)) / 2.0 as POP18 FROM `tcc-research.acs_sources.S0101_us_states_acs5y_2023` ORDER BY STATE_FIPS;",
  );

  const statePop: StatePop[] = rows.map((row) => ({
    fips: String(row.STATE_FIPS).padStart(2, "0"),
    pop18: Math.round(row.POP18),
  }));

  // Add in Alabama
  if(!statePop.find((state) => state.fips === "01")) {
    statePop.unshift({
      fips: "01",
      pop18: 45366,
    });  
  }
  return statePop;
}
