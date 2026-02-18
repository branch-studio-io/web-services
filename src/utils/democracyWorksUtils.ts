import {
  type Election,
  type YouthRegistration,
  PreregStatus,
} from "@/types/democracyWorks";
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
 * Returns a qualitative statement about which high school grade levels can
 * register to vote, based on youth registration eligibility. Uses terms like
 * "all", "most", "many", and "even some" rather than exact percentages.
 *
 * Assumes: Sophomores 15–16 (most commonly 16), Juniors 16–17 (most commonly 17),
 * Seniors 17–18 (most commonly 18).
 *
 * @param youthRegistration - Authority youth registration config with
 *   supported, eligibilityAge, and eligibilityByElection
 * @returns Statement like "all seniors, all juniors, and most sophomores can
 *   register..." or null if youth preregistration is not supported
 */
export function studentImpactText(
  youthRegistration: YouthRegistration | null | undefined,
  asOfDate: Date = new Date(),
): string | null {
  if (!youthRegistration) return null;

  if (youthRegistration.supported === "byAge") {
    const age = getAge(youthRegistration.eligibilityAge);
    const gradeAges = getExpectedGradeAges(asOfDate);
    return studentImpactByAge(age, gradeAges);
  }

  if (youthRegistration.supported === "byElection") {
    const electionDate = youthRegistration.eligibilityByElection?.date;
    return studentImpactByElection(electionDate);
  }

  return null;
}

export type GradeAges = {
  seniors: number;
  juniors: number;
  sophomores: number;
  freshmen: number;
};

/**
 * Returns the expected typical current age for each high school grade level
 * based on the date. In the fall, students are younger (just started the
 * grade); in the spring, they are older.
 *
 * Assumes US school year Sept–May: fall = younger, spring = older.
 * Sophomores 15→16, Juniors 16→17, Seniors 17→18 over the year.
 *
 * @param date - Date to evaluate (default: today)
 */
export function getExpectedGradeAges(date: Date = new Date()): GradeAges {
  const month = date.getMonth();
  // Progress 0 at Sept (start of year), 1 at May (end). June–Aug use end-of-year ages.
  const progress =
    month >= 8 ? (month - 8) / 8 : month <= 4 ? (month + 4) / 8 : 1;

  return {
    seniors: 17 + progress,
    juniors: 16 + progress,
    sophomores: 15 + progress,
    freshmen: 14 + progress,
  };
}

/** Qualifier for how many in a grade qualify: "all" | "most" | "many" | "even some" | null (none) */
function qualifierForGrade(
  eligibilityAge: number,
  typicalAge: number,
): "all" | "most" | "many" | "even some" | null {
  if (eligibilityAge <= typicalAge - 0.25) return "all";
  if (eligibilityAge <= typicalAge + 0.25) return "most";
  if (eligibilityAge <= typicalAge + 0.5) return "many";
  if (eligibilityAge <= typicalAge + 0.75) return "even some";
  return null;
}

function studentImpactByAge(
  eligibilityAge: number,
  gradeAges: GradeAges,
): string {
  const seniorQ = qualifierForGrade(eligibilityAge, gradeAges.seniors);
  const juniorQ = qualifierForGrade(eligibilityAge, gradeAges.juniors);
  const sophQ = qualifierForGrade(eligibilityAge, gradeAges.sophomores);
  const freshQ = qualifierForGrade(eligibilityAge, gradeAges.freshmen);

  const parts: string[] = [];
  if (seniorQ) parts.push(`${seniorQ} seniors`);
  if (juniorQ) parts.push(`${juniorQ} juniors`);
  if (sophQ) parts.push(`${sophQ} sophomores`);
  if (freshQ) parts.push(`${freshQ} freshmen`);

  if (parts.length === 0) return "most seniors"; // fallback for 18+ only
  if (parts.length === 1) return parts[0];
  const last = parts.pop();
  return `${parts.join(", ")}, and ${last}`;
}

function studentImpactByElection(
  electionDate: string | null | undefined,
): string {
  // Must be 18 by election; sophomores (15-16) never qualify
  if (!electionDate) {
    return "most seniors and many juniors";
  }

  const now = new Date();
  const election = new Date(electionDate + "T00:00:00");
  if (Number.isNaN(election.getTime())) {
    return "most seniors and many juniors";
  }

  const monthsUntilElection =
    (election.getFullYear() - now.getFullYear()) * 12 +
    (election.getMonth() - now.getMonth());

  if (monthsUntilElection >= 12) {
    return "all seniors, most juniors";
  }
  if (monthsUntilElection >= 6) {
    return "all seniors and most juniors";
  }
  if (monthsUntilElection >= 3) {
    return "most seniors and many juniors";
  }
  return "most seniors and even some juniors";
}

/**
 * Returns the first available registration deadline for an election, in order:
 * online, byMail, inPerson.
 */
export type RegistrationDeadline =
  | { date: string; method: "online" }
  | { date: string; method: "byMail" }
  | { date: string; method: "inPerson" };

export function getRegistrationDeadline(
  election: Election,
): RegistrationDeadline | null {
  const reg = election.registration;
  if (!reg) return null;

  const onlineDate = reg.online?.deadline?.date;
  if (onlineDate) return { date: onlineDate, method: "online" };

  const byMailDate = reg.byMail?.deadline?.date;
  if (byMailDate) return { date: byMailDate, method: "byMail" };

  const inPersonDate = reg.inPerson?.deadline?.date;
  if (inPersonDate) return { date: inPersonDate, method: "inPerson" };

  return null;
}

/**
 * Formats a registration deadline for display, appending "by mail" or "in person"
 * when the method is not online.
 */
export function formatDeadlineSuffix(deadline: RegistrationDeadline): string {
  const formatted = formatElectionDate(deadline.date);
  if (deadline.method === "online") return formatted;
  if (deadline.method === "byMail") return `${formatted} by mail`;
  return `${formatted} in person`;
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
