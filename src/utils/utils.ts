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
