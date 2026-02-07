import type { YouthRegistration } from "@/types/democracy-works";
import { readFile } from "fs/promises";
import path from "path";

type AuthoritiesJson = {
  data: {
    authorities: Array<{
      ocdId: string;
      youthRegistration: YouthRegistration | null;
    }>;
  };
};

/**
 * Reads authorities.json and returns youth registration data keyed by 2-letter
 * state code (parsed from the last 2 characters of each authority's ocdId).
 */
export async function getYouthRegistration(): Promise<
  Record<string, YouthRegistration>
> {
  const dataDir = path.join(process.cwd(), "data");
  const filePath = path.join(dataDir, "authorities.json");
  const json = await readFile(filePath, "utf-8");
  const { data } = JSON.parse(json) as AuthoritiesJson;
  const result: Record<string, YouthRegistration> = {};

  for (const authority of data.authorities) {
    if (!authority.youthRegistration) continue;
    const stateCode = authority.ocdId.slice(-2).toUpperCase();
    result[stateCode] = authority.youthRegistration;
  }

  return result;
}
