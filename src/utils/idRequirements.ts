/**
 * Extracts short ID requirement bullets from long voter registration instructions
 * using pattern matching and a dictionary of common phrases.
 */

export type IdRequirementsResult = {
  bullets: string[];
  fullText: string;
};

const ID_REQUIREMENT_PATTERNS: { pattern: RegExp; label: string }[] = [
  {
    pattern:
      /(?:new\s+york\s+)?state[- ]?issued\s+(?:id|identification)(?:\s+number)?/gi,
    label: "State-issued ID",
  },
  {
    pattern:
      /driver'?s?\s*license|state\s+id\s*(?:card|number)?|id\s+card|penndot\s+id|non[- ]?operating\s+(?:identification|id)|dmv[- ]?issued|nonoperating\s+identification/gi,
    label: "Driver's license or state ID",
  },
  {
    pattern:
      /last\s+five\s+digits\s+of\s+(?:your\s+)?(?:social\s+security|ssn)/gi,
    label: "Last 5 digits of SSN",
  },
  {
    pattern:
      /last\s+(?:four|4)\s+digits\s+(?:of\s+(?:your\s+)?(?:social\s+security|ssn)|of\s+your\s+social\s+security\s+number)|\bssn\b|social\s+security\s+number(?!\s*and)/gi,
    label: "Last 4 digits of SSN",
  },
  {
    pattern:
      /indicate\s+["']?(?:none|NONE)["']?|check\s+the\s+box\s+that\s+indicates\s+you\s+do\s+not\s+have\s+an?\s+id|do\s+not\s+have\s+an?\s+id\s+number|have\s+not\s+been\s+issued\s+any\s+of\s+these\s+numbers/gi,
    label: "Indicate 'None' if not applicable",
  },
  {
    pattern:
      /upload\s+(?:a\s+)?(?:digital\s+)?(?:image\s+of\s+)?your\s+signature|digital\s+image\s+of\s+your\s+signature/gi,
    label: "Signature upload (if no state ID)",
  },
  {
    pattern:
      /(?:can\s+still|you\s+can\s+still)\s+(?:register|submit)\s+(?:a\s+voter\s+registration\s+)?(?:application\s+)?by\s+mail|register\s+by\s+mail\s+(?:without\s+id|as\s+fallback)?/gi,
    label: "Can register by mail without ID",
  },
];

function stripHtmlForMatching(text: string): string {
  return text
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extracts a short bulleted list of ID requirements from long registration
 * instruction text using pattern matching.
 *
 * @param instructions - Raw instruction string (e.g. from authority.registration.online.instructions or byMail.idInstructions)
 * @returns Object with bullets array (may be empty) and fullText for accordion display
 */
export function extractIdRequirements(
  instructions: string | null,
): IdRequirementsResult {
  const fullText = instructions?.trim() ?? "";
  if (!fullText) {
    return { bullets: [], fullText };
  }

  const plainText = stripHtmlForMatching(fullText);
  const seen = new Set<string>();
  const bullets: string[] = [];

  for (const { pattern, label } of ID_REQUIREMENT_PATTERNS) {
    if (pattern.test(plainText) && !seen.has(label)) {
      seen.add(label);
      bullets.push(label);
    }
  }

  return { bullets, fullText };
}
