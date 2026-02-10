import statesJson from "@/data/states.json";
import type { State } from "@/types/state";
import type { StatePop } from "@/types/statePop";
import { BigQuery } from "@google-cloud/bigquery";
import "dotenv/config";

const states = statesJson as State[];

const projectId = process.env.GCLOUD_PROJECT || "tcc-research";
const location = process.env.GCLOUD_LOCATION || "US";

const authPath = process.env.GCLOUD_AUTH_PATH;
if (!authPath) {
  throw new Error("Missing GCLOUD_AUTH_PATH");
}

const bigquery = new BigQuery({
  projectId: projectId,
  keyFilename: authPath,
});

export async function getStatePopulations(): Promise<StatePop[]> {
  const [rows] = await bigquery.query(
    "SELECT STATE AS STATE_FIPS, NAME AS STATE_NAME, POPESTIMATE2023 AS POPULATION FROM `tcc-research.census_pop_est.pop_est_syasex_race5_us_states_2023` WHERE SEX = 0 AND ORIGIN = 0 AND RACE = 1 AND AGE = 18 ORDER BY NAME;",
    {
      location: location,
    },
  );

  const statePop: StatePop[] = rows.map((row) => ({
    code: states.find((state) => state.name === row.STATE_NAME)?.code || "",
    pop18: row.POPULATION,
  }));

  return statePop;
}
