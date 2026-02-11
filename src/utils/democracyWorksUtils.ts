import { type YouthRegistration, PreregStatus } from "@/types/democracyWorks";
import { NO_DATA_COLOR, THREE_COLOR_DIVERGENT_SCALE } from "@/utils/globals";

export const PREREG_STATUS_COLORS: Record<PreregStatus, string> = {
  [PreregStatus.AGE_16_OR_EARLIER]: THREE_COLOR_DIVERGENT_SCALE[0],
  [PreregStatus.AT_LEAST_ONE_YEAR]: THREE_COLOR_DIVERGENT_SCALE[1],
  [PreregStatus.LESS_THAN_ONE_YEAR]: THREE_COLOR_DIVERGENT_SCALE[2],
  [PreregStatus.NOT_AVAILABLE]: NO_DATA_COLOR,
};

// Parse "ocd-division/country:us/state:fl/cd:1" to return the state code in uppercase
export function parseStateCode(ocdId: string): string {
  return (
    ocdId
      .split("/")
      .find((part) => part.startsWith("state:"))
      ?.split(":")[1]
      .toUpperCase() ?? ""
  );
}

/**
 * Parses an ISO 8601 duration string (e.g. P16Y, P17Y6M, P17Y275D) and returns
 * the equivalent age as a decimal. Years are whole, months contribute 1/12,
 * and days contribute 1/365.
 *
 * @example P16Y → 16, P17Y6M → 17.5, P17Y275D → 17.75
 */
export function getAge(eligibilityAge: string | null): number {
  if (!eligibilityAge || !eligibilityAge.startsWith("P")) return 0;

  const yearsMatch = eligibilityAge.match(/(\d+)Y/);
  const monthsMatch = eligibilityAge.match(/(\d+)M/);
  const daysMatch = eligibilityAge.match(/(\d+)D/);

  const years = yearsMatch ? Number.parseInt(yearsMatch[1], 10) : 0;
  const months = monthsMatch ? Number.parseInt(monthsMatch[1], 10) : 0;
  const days = daysMatch ? Number.parseInt(daysMatch[1], 10) : 0;

  return years + months / 12 + days / 365;
}

export function nextRegOpportunityIsGeneral(
  youthRegistration: YouthRegistration,
) {
  const date = youthRegistration.eligibilityByElection?.date;
  return (
    youthRegistration.supported === "byElection" &&
    (youthRegistration.eligibilityByElectionType?.includes("general") ||
      (date != null && new Date(date).getMonth() === 10))
  );
}

export function voterEligibilityText(youthRegistration: YouthRegistration) {
  if (youthRegistration.supported === "byAge") {
    return voterRegistrationAgeText(youthRegistration.eligibilityAge);
  } else if (youthRegistration.supported === "byElection") {
    const p1 = `You will be 18 by ${formatElectionDate(youthRegistration.eligibilityByElection?.date ?? "")}.`;
    const type = youthRegistration.eligibilityByElectionType;
    const p2 = type ? `(18 by the ${type}.)` : "";
    return [p1, p2].filter(Boolean).join(" ");
  }
  return "Registration is not required.";
}

/**
 * Formats an ISO date string (YYYY-MM-DD) as "Nov 3rd, 2026".
 */
export function formatElectionDate(date: string): string {
  const d = new Date(date + "T00:00:00");
  if (Number.isNaN(d.getTime())) return date;

  const month = d.toLocaleString("en-US", { month: "short" });
  const day = d.getDate();
  const year = d.getFullYear();

  const ord =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return `${month} ${day}${ord}, ${year}`;
}

/**
 * Converts an ISO 8601 duration string (e.g. P15Y, P17Y6M, P17Y275D) into
 * human-readable age text. When a days component is present, computes days
 * until the target age (e.g. "You will turn 18 in 90 days").
 *
 * @param eligibilityAge - ISO 8601 duration (e.g. P16Y, P17Y6M, P17Y275D)
 * @param targetAge - Age to use in "turn X in N days" (default 18)
 * @returns Human-readable string (e.g. "You are 15 years old.")
 */
export function voterRegistrationAgeText(
  eligibilityAge: string,
  targetAge: number = 18,
): string {
  if (!eligibilityAge?.startsWith("P")) return "";

  const yearsMatch = eligibilityAge.match(/(\d+)Y/);
  const monthsMatch = eligibilityAge.match(/(\d+)M/);
  const daysMatch = eligibilityAge.match(/(\d+)D/);

  const years = yearsMatch ? Number.parseInt(yearsMatch[1], 10) : 0;
  const months = monthsMatch ? Number.parseInt(monthsMatch[1], 10) : 0;
  const days = daysMatch ? Number.parseInt(daysMatch[1], 10) : 0;

  // Days component present → compute days until target age
  if (daysMatch && days > 0) {
    const age = getAge(eligibilityAge);
    const daysUntilTarget = Math.round((targetAge - age) * 365);
    return `You will turn ${targetAge} in ${daysUntilTarget} days.`;
  }

  // Years + months (no days)
  if (months > 0) {
    const monthLabel = months === 1 ? "month" : "months";
    return `You are ${years} years and ${months} ${monthLabel} old.`;
  }

  // Years only
  const yearLabel = years === 1 ? "year" : "years";
  return `You are ${years} ${yearLabel} old.`;
}
