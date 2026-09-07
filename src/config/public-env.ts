const neonAuthUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL;
const neonDataApiUrl = process.env.NEXT_PUBLIC_NEON_DATA_API_URL;

if (!neonAuthUrl || !neonDataApiUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_NEON_AUTH_URL or NEXT_PUBLIC_NEON_DATA_API_URL.",
  );
}

export const publicEnv = {
  neonAuthUrl,
  neonDataApiUrl,
} as const;
