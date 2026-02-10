/**
 * Splits a string by one or more sequential <br> or <br /> tags.
 * Returns an array of non-empty trimmed strings.
 */
export function splitByBreakTags(text: string): string[] {
  return text
    .split(/(?:<br\s*\/?>\s*)+/gi)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function getEnvKey(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable ${key}`);
  }
  return value;
}

export function getEnvKeyBool(key: string): boolean {
  const value = process.env[key];
  return value === "true";
}
