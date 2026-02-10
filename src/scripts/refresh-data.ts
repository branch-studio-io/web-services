import { getYouthRegistration } from "@/utils/democracyWorkApi";
import { getStatePopulations } from "@/utils/tccBigQueryApi";

import "dotenv/config";
import { writeFile } from "fs/promises";
import path from "path";

async function main(): Promise<void> {
  console.log("Fettching Democracy Works Youth Registrations...");
  const stateYouthRegistrations = await getYouthRegistration();

  await writeFile(
    path.resolve(process.cwd(), "src/data/youth-registrations.json"),
    JSON.stringify(stateYouthRegistrations, null, 2),
  );

  // console.log("Fettching Big QueryState Populations...");
  // const statePopulations = await getStatePopulations();
  // await writeFile(
  //   path.resolve(process.cwd(), "src/data/state-pops.json"),
  //   JSON.stringify(statePopulations, null, 2),
  // );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
