import type { YouthRegistration } from "@/types/democracy-works";
import authoritiesData from "@/data/authorities.json";

type AuthoritiesJson = {
  data: {
    authorities: Array<{
      ocdId: string;
      youthRegistration: YouthRegistration | null;
    }>;
  };
};

const { data } = authoritiesData as AuthoritiesJson;

/**
 * Reads authorities.json and returns youth registration data keyed by 2-letter
 * state code (parsed from the last 2 characters of each authority's ocdId).
 */
export async function getYouthRegistration(): Promise<
  Record<string, YouthRegistration>
> {
  const result: Record<string, YouthRegistration> = {};

  for (const authority of data.authorities) {
    if (!authority.youthRegistration) continue;
    const stateCode = authority.ocdId.slice(-2).toUpperCase();
    result[stateCode] = authority.youthRegistration;
  }

  return result;
}
