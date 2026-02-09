import { getYouthRegistration } from "@/utils/democracyWorkApi";
import "dotenv/config";
import { writeFile } from "fs/promises";
import path from "path";

async function main(): Promise<void> {
  const stateYouthRegistrations = await getYouthRegistration();

  const filePath = path.resolve(
    process.cwd(),
    "src/data/youth-registrations.json",
  );

  await writeFile(filePath, JSON.stringify(stateYouthRegistrations, null, 2));
  console.log("Wrote youth-registrataions.json");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
