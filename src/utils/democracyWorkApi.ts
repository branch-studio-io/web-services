import type {
  Authority,
  Election,
  YouthRegistration,
} from "@/types/democracyWorks";
import { PreregStatus } from "@/types/democracyWorks";
import { getAge, nextRegOpportunityIsGeneral } from "./democracyWorksUtils";
import { getEnvKey } from "./utils";

/**
 * Classifies a youth registration into a pre-registration status category.
 * Returns NOT_AVAILABLE for null/undefined.
 */
export function getPreregStatus(
  youth: YouthRegistration | null | undefined,
): PreregStatus {
  if (!youth) {
    return PreregStatus.NOT_AVAILABLE;
  }

  const age = getAge(youth.eligibilityAge);

  if (youth.supported === "byAge" && age <= 16) {
    return PreregStatus.AGE_16_OR_EARLIER;
  }

  if (
    (youth.supported === "byAge" && age <= 17) ||
    nextRegOpportunityIsGeneral(youth)
  ) {
    return PreregStatus.AT_LEAST_ONE_YEAR;
  }

  if (youth.supported === "byElection" || youth.supported === "byAge") {
    return PreregStatus.LESS_THAN_ONE_YEAR;
  }

  return PreregStatus.NOT_AVAILABLE;
}

type Pagination = {
  totalRecordCount: number;
  currentPage: number;
  pageSize: number;
};

type AuthoritiesResponse = {
  data: { authorities: Array<Authority> };
  pagination: Pagination;
};

type ElectionsResponse = {
  data: { elections: Array<Election> };
  pagination: Pagination;
};

type PageDataResult<T> = {
  items: T[];
  totalRecordCount: number;
};

/**
 * Fetches all pages from a paginated Democracy Works API URL and concatenates
 * results. Pass a URL builder and an extractor for the item array and total count.
 */
async function fetchPageData<T>(
  getPageUrl: (page: number) => string,
  options: {
    headers: Record<string, string>;
    pageSize: number;
  },
  extract: (json: unknown) => PageDataResult<T>,
): Promise<T[]> {
  const { headers, pageSize } = options;
  const allItems: T[] = [];
  let currentPage = 1;
  let totalPages = 1;

  do {
    const url = getPageUrl(currentPage);

    const response = await fetch(url, { headers });
    const json = (await response.json()) as unknown;
    const { items, totalRecordCount } = extract(json);

    allItems.push(...items);
    totalPages = Math.ceil(totalRecordCount / pageSize) || 1;
    currentPage += 1;
  } while (currentPage <= totalPages);

  return allItems;
}

export async function getAuthorities(): Promise<Authority[]> {
  const apiKey = getEnvKey("DEMOCRACY_WORKS_API_KEY");
  const fields = ["ocdId", "registration", "youthRegistration"];
  const pageSize = 51;
  const baseParams = new URLSearchParams({
    fields: fields.join(","),
    pageSize: String(pageSize),
  });

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(baseParams);
    params.set("page", String(page));
    return `https://api.democracy.works/v2/authorities/state?${params.toString()}`;
  };

  return fetchPageData<Authority>(
    getPageUrl,
    {
      headers: {
        "X-API-KEY": apiKey,
        "Accept-Language": "en-US",
      },
      pageSize,
    },
    (json) => {
      const res = json as AuthoritiesResponse;
      return {
        items: res.data.authorities,
        totalRecordCount: res.pagination.totalRecordCount,
      };
    },
  );
}

export async function getElections(): Promise<Election[]> {
  const apiKey = getEnvKey("DEMOCRACY_WORKS_API_KEY");
  const fields = ["ocdId", "date", "description", "type"];
  const electionTypes = [
    "presidentialPrimary",
    "state",
    "stateSenate",
    "stateHouse",
    "congressional",
    "senate",
  ];
  const pageSize = 50;
  const baseParams = new URLSearchParams({
    fields: fields.join(","),
    pageSize: String(pageSize),
    electionTypes: electionTypes.join(","),
    startDate: new Date().toISOString().split("T")[0],
  });

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(baseParams);
    params.set("page", String(page));
    return `https://api.democracy.works/v2/elections?${params.toString()}`;
  };

  return fetchPageData<Election>(
    getPageUrl,
    {
      headers: {
        "X-API-KEY": apiKey,
        "Accept-Language": "en-US",
      },
      pageSize,
    },
    (json) => {
      const res = json as ElectionsResponse;
      return {
        items: res.data.elections,
        totalRecordCount: res.pagination.totalRecordCount,
      };
    },
  );
}
