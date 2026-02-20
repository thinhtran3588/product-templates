import { getRequestConfig } from "next-intl/server";

import { isSupportedLocale, routing } from "@/common/routing/routing";

type SupportedLocale = "en" | "vi" | "zh";
type Messages = Record<string, unknown>;

const messageLoaders: Record<SupportedLocale, () => Promise<Messages>> = {
  en: () =>
    import("@/application/localization/en.json").then(
      (m) => m.default as Messages,
    ),
  vi: () =>
    import("@/application/localization/vi.json").then(
      (m) => m.default as Messages,
    ),
  zh: () =>
    import("@/application/localization/zh.json").then(
      (m) => m.default as Messages,
    ),
};

type RequestConfigParams = {
  requestLocale: Promise<string | undefined>;
};

export async function requestConfig({ requestLocale }: RequestConfigParams) {
  const locale = await requestLocale;
  const resolvedLocale = isSupportedLocale(locale)
    ? locale
    : routing.defaultLocale;

  const messages = await messageLoaders[resolvedLocale]();

  return {
    locale: resolvedLocale,
    messages,
  };
}

export default getRequestConfig(requestConfig);
