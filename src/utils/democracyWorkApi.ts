import type { YouthRegistration, StateYouthRegistration } from "@/types/democracy-works";

type YouthRegistrationRaw = {
  data: {
    authorities: Array<{
      ocdId: string;
      youthRegistration: YouthRegistration;
    }>;
  };
};

export async function getYouthRegistration(): Promise<
  StateYouthRegistration[]
> {
  const response = await fetch(
    "https://api.democracy.works/v2/authorities/state?fields=ocdId,youthRegistration&pageSize=51",
    { 
      headers: { 
        "X-API-KEY": process.env.DEMOCRACY_WORKS_API_KEY,
        "Accept-Language": "en-US",
      } 
    },
  );
  const data = (await response.json()) as YouthRegistrationRaw;

  console.log(JSON.stringify(data, null, 2));

  const stateYouthRegistrations: StateYouthRegistration[] =
    data.data.authorities.map((authority) => ({
      state: authority.ocdId.slice(-2).toUpperCase(),
      youthRegistration: authority.youthRegistration,
    }));

  return stateYouthRegistrations;
}
