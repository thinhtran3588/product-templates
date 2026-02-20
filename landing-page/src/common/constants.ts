export const APP_NAME = "SparkMap";

export const SUPPORT_EMAIL = "support@gemsignal.com";
export const SUPPORT_API_URL = "https://support-api.gemsignal.com/contact";

// TODO: Set these URLs before going to production.
// Use environment variables so they can differ per environment:
//   NEXT_PUBLIC_LINK_WEB, NEXT_PUBLIC_LINK_ANDROID, NEXT_PUBLIC_LINK_IOS, NEXT_PUBLIC_LINK_MACOS
// Empty values render the platform card as "Coming Soon".
export const LINKS = {
  WEB: process.env.NEXT_PUBLIC_LINK_WEB ?? "",
  ANDROID: process.env.NEXT_PUBLIC_LINK_ANDROID ?? "",
  IOS: process.env.NEXT_PUBLIC_LINK_IOS ?? "",
  MACOS: process.env.NEXT_PUBLIC_LINK_MACOS ?? "",
} as const;
