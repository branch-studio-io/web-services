import { getAuthorities, getElections } from "@/utils/democracyWorkApi";
import { getStatePopulations } from "@/utils/tccBigQueryApi";

import "dotenv/config";
import { writeFile } from "fs/promises";
import path from "path";

async function main(): Promise<void> {
  // console.log("Fetching Democracy Works Authorities...");
  // await writeData(await getAuthorities(), "src/data/authorities.json");

  // console.log("Fettching Big QueryState Populations...");
  // await writeData(await getStatePopulations(), "src/data/state-pops.json");

  console.log("Fetching Democracy Works Elections...");
  await writeData(await getElections(), "src/data/elections.json");
}

async function writeData(data: any, filePath: string) {
  const fileFullPath = path.resolve(process.cwd(), filePath);
  await writeFile(fileFullPath, JSON.stringify(data, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
