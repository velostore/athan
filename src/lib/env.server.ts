import process from "node:process";

const ENV_CACHE = new Map<string, string>();

function get(key: string, fallback?: string): string {
  if (ENV_CACHE.has(key)) return ENV_CACHE.get(key)!;
  const val = process.env[key] ?? fallback;
  if (val !== undefined) ENV_CACHE.set(key, val);
  return val ?? "";
}

export function getServerConfig() {
  return {
    nodeEnv: get("NODE_ENV", "development"),
    port: parseInt(get("PORT", "3000"), 10),
    rateLimitMax: parseInt(get("RATE_LIMIT_MAX", "60"), 10),
    allowedOrigins: get("ALLOWED_ORIGINS", "http://localhost:3000"),
    isProd: get("NODE_ENV", "development") === "production",
  };
}
