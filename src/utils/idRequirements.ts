/**
 * Extracts ID requirement types from long voter registration instructions
 * using pattern matching against a taxonomy of requirement enums.
 */

/** Single source of truth: order, label, definition, and pattern per requirement type */
export const ID_REQUIREMENTS = {
  STATE_DL_OR_ID: {
    order: 1,
    label: "State ID",
    definition:
      "State driver's license or ID number (includes learner's permit, non-driver ID)",
    pattern:
      /driver'?s?\s*license|state\s+id|state[- ]?issued\s+id|learner'?s?\s*permit|non[- ]?(?:driver|operating|operators)|dmv[- ]?issued|dmv\s+id|mva\s+id|penn\s*dot|penndot|identification\s+(?:card|number)|id\s+card|motor\s+vehicle|registry\s+of\s+motor|mvd\s+id|scdmv|ncdmv|service\s+oklahoma|bureau\s+of\s+motor\s+vehicles/i,
  },
  SSN: {
    order: 2,
    label: "SSN",
    definition: "Social Security number (partial or full, depending on state)",
    pattern:
      /social\s+security|\bssn\b|last\s+(?:four|4|five|5)\s+digits\s+of\s+(?:your\s+)?(?:social\s+security|ssn)|full\s+social\s+security/i,
  },
  PROOF_OF_ID_OR_RESIDENCE: {
    order: 3,
    label: "Proof of ID or Residence",
    definition:
      "Copy of photo ID or document showing name and address (e.g. utility bill, bank statement, lease)",
    pattern:
      /copy\s+of|proof\s+of\s+(?:identity|residence|residency)|submit.*copy|include\s+(?:a\s+)?copy|utility\s+bill|bank\s+statement|government\s+check|paycheck|paystub|lease|rental\s+agreement|mortgage|proof\s+of\s+insurance|enrollment\s+letter/i,
  },
  PROOF_OF_CITIZENSHIP: {
    order: 4,
    label: "Proof of Citizenship",
    definition:
      "Proof of citizenship (e.g. certificate of citizenship, naturalization, birth certificate)",
    pattern:
      /proof\s+of\s+.*citizenship|certificate\s+of\s+(?:united\s+states\s+)?citizenship|certificate\s+of\s+naturalization/i,
  },
  SIGNATURE: {
    order: 5,
    label: "Signature",
    definition:
      "Signature required (DMV-stored, in-process capture, or upload of digital image)",
    pattern:
      /signature|digital\s+image\s+of\s+your\s+signature|upload.*signature|sign\s+on[- ]?screen|dmv[- ]?stored|on\s+file\s+with\s+dmv|touchscreen|sign\s+during\s+the\s+process/i,
  },
  NONE_FALLBACK: {
    order: 6,
    label: "None",
    definition: "Alternative options are available if you do not have ID. See full details.",
    pattern:
      /indicate\s+["']?none["']?|write\s+["']?none["']?|check\s+the\s+box.*do\s+not\s+have|leave\s+that\s+field\s+blank|do\s+not\s+have\s+an?\s+id|have\s+not\s+been\s+issued|state\s+assigns|unique\s+(?:identifier|id|identifying)\s+(?:number|will\s+be\s+provided)?|unique\s+identifier\s+will\s+be\s+provided|will\s+be\s+assigned|can\s+still\s+(?:register|submit|use)|register\s+by\s+mail|submit.*by\s+mail|visit.*county.*in\s+person|clerk'?s?\.?\s*office\s+will\s+issue|generate\s+a\s+pdf\s+form|do\s+not\s+possess.*(?:driver|social\s+security)/i,
  },
  FIRST_TIME_ID_AT_POLLS: {
    order: 7,
    label: "First-Time Voter ID at Polls",
    definition: "Must show ID when voting for the first time",
    pattern:
      /first\s+time\s+(?:you\s+)?vote|first\s+time\s+voting|identification\s+when\s+you\s+vote|show\s+id\s+the\s+first\s+time|verify\s+your\s+identity\s+the\s+first\s+time|provide\s+identification\s+when\s+voting|vote\s+in\s+person\s+the\s+first\s+time/i,
  },
  FIRST_TIME_PROOF_WITH_APPLICATION: {
    order: 8,
    label: "First-Time Proof with Application",
    definition:
      "First-time registrants: must submit proof of ID with application if no ID number provided",
    pattern:
      /registering\s+(?:to\s+vote\s+)?for\s+the\s+first\s+time.*(?:submit|include|copy)|first\s+time\s+in\s+your\s+jurisdiction.*(?:submit|copy)/i,
  },
  EXEMPTIONS: {
    order: 9,
    label: "Exemptions",
    definition:
      "Exemptions for ID requirement (e.g. 65+, disability, military, overseas)—see full text",
    pattern:
      /exempt\s+from\s+the\s+id\s+requirement|65\s+years\s+old|have\s+a\s+disability|uniformed\s+services|merchant\s+marines|residing\s+outside\s+the\s+us/i,
  },
} as const;

export type IdRequirementType = keyof typeof ID_REQUIREMENTS;

function stripHtmlForMatching(text: string): string {
  return text
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extracts ID requirement types from long registration instruction text
 * using pattern matching.
 *
 * @param instructions - Raw instruction string (e.g. from authority.registration.online.instructions or byMail.idInstructions)
 * @returns Array of IdRequirementType values found in the text, ordered
 */
export function extractIdRequirements(
  instructions: string | null,
): IdRequirementType[] {
  if (!instructions?.trim()) {
    return [];
  }

  const plainText = stripHtmlForMatching(instructions);
  const seen = new Set<IdRequirementType>();
  const bullets: IdRequirementType[] = [];

  for (const [type, config] of Object.entries(ID_REQUIREMENTS) as [
    IdRequirementType,
    (typeof ID_REQUIREMENTS)[IdRequirementType],
  ][]) {
    if (config.pattern.test(plainText) && !seen.has(type)) {
      seen.add(type);
      bullets.push(type);
    }
  }

  bullets.sort((a, b) => ID_REQUIREMENTS[a].order - ID_REQUIREMENTS[b].order);

  return bullets;
}
