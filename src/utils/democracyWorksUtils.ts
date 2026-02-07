import { YouthRegistration } from "@/types/democracy-works";

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

/**
 * Checks if the eligibilityByElectionType contains the word general or if they can
 * register in November. Had to add the Nov check since I can't 100% count on eligibilityByElectionType
 * @param youthRegistration
 * @returns
 */
export function canRegInGeneral(youthRegistration: YouthRegistration) {
  const date = youthRegistration.eligibilityByElection?.date;
  return (
    youthRegistration.supported === "byElection" &&
    (youthRegistration.eligibilityByElectionType?.includes("general") ||
      (date != null && new Date(date).getMonth() === 10))
  );
}
