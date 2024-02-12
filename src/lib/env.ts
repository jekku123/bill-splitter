import "dotenv/config";

export const postgresUrl = assertValue(
  process.env.POSTGRES_URL,
  "Missing environment variable: POSTGRES_URL",
);

export const nextAuthSecret = assertValue(
  process.env.NEXTAUTH_SECRET,
  "Missing environment variable: NEXTAUTH_SECRET",
);
export const nextAuthUrl = assertValue(
  process.env.NEXTAUTH_URL,
  "Missing environment variable: NEXTAUTH_URL",
);
export const githubId = assertValue(
  process.env.AUTH_GITHUB_ID,
  "Missing environment variable: AUTH_GITHUB_ID",
);
export const githubSecret = assertValue(
  process.env.AUTH_GITHUB_SECRET,
  "Missing environment variable: AUTH_GITHUB_SECRET",
);

export const useCdn = false;

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
