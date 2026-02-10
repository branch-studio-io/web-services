import { getAuthorities } from "@/utils/democracyWorkApi";
import { getStatePopulations } from "@/utils/tccBigQueryApi";

import "dotenv/config";
import { writeFile } from "fs/promises";
import path from "path";

async function main(): Promise<void> {
  console.log("Fetching Democracy Works Authorities...");
  const authorities = await getAuthorities();

  await writeFile(
    path.resolve(process.cwd(), "src/data/authorities.json"),
    JSON.stringify(authorities, null, 2),
  );

  console.log("Fettching Big QueryState Populations...");
  const statePopulations = await getStatePopulations();
  await writeFile(
    path.resolve(process.cwd(), "src/data/state-pops.json"),
    JSON.stringify(statePopulations, null, 2),
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
