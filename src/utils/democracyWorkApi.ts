import type { Authoritie } from "@/types/democracyWorks";
import { getEnvKey } from "./utils";

type DataResponse = {
  data: {
    authorities: Array<Authoritie>;
  };
};

export async function getAuthorities(): Promise<Authoritie[]> {
  const apiKey = getEnvKey("DEMOCRACY_WORKS_API_KEY");

  const fields = ["ocdId", "registration.online", "youthRegistration"];

  const response = await fetch(
    `https://api.democracy.works/v2/authorities/state?fields=${fields.join(",")}&pageSize=51`,
    {
      headers: {
        "X-API-KEY": apiKey,
        "Accept-Language": "en-US",
      },
    },
  );
  const json = (await response.json()) as DataResponse;

  return json.data.authorities;
}
