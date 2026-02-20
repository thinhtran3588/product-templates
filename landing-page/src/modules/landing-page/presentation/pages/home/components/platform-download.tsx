"use client";

import { useTranslations } from "next-intl";

import { AndroidIcon, AppleIcon, MonitorIcon } from "@/common/components/icons";
import { LINKS } from "@/common/constants";
import { cn } from "@/common/utils/cn";

export function PlatformDownload() {
  const t = useTranslations("modules.landing.pages.home.download");

  const platforms = [
    {
      key: "web",
      icon: MonitorIcon,
      label: t("platforms.web"),
      href: LINKS.WEB,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      key: "android",
      icon: AndroidIcon,
      label: t("platforms.android"),
      href: LINKS.ANDROID,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      key: "ios",
      icon: AppleIcon,
      label: t("platforms.ios"),
      href: LINKS.IOS,
      color: "text-gray-900 dark:text-gray-100",
      bg: "bg-gray-500/10",
      border: "border-gray-500/20",
    },
    {
      key: "macos",
      icon: AppleIcon,
      label: t("platforms.macos"),
      href: LINKS.MACOS,
      color: "text-gray-900 dark:text-gray-100",
      bg: "bg-gray-500/10",
      border: "border-gray-500/20",
    },
  ];

  return (
    <div className="space-y-12">
      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mx-auto max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
          {t("description")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
        {platforms.map((platform) => {
          const isComingSoon = !platform.href;
          const sharedClassName = cn(
            "group relative flex flex-col items-center gap-4 rounded-2xl border p-6 transition-all duration-300",
            "glass-panel",
            platform.border,
          );
          const iconEl = (
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300",
                !isComingSoon && "group-hover:scale-110",
                platform.bg,
                platform.color,
              )}
            >
              <platform.icon className="h-6 w-6" />
            </div>
          );
          const labelEl = (
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="font-medium text-[var(--text-primary)]">
                {platform.label}
              </span>
              {isComingSoon && (
                <span className="text-[10px] font-bold tracking-wider text-[var(--text-muted)] uppercase">
                  {t("comingSoon")}
                </span>
              )}
            </div>
          );

          if (isComingSoon) {
            return (
              <div
                key={platform.key}
                className={cn(sharedClassName, "cursor-not-allowed opacity-60")}
                aria-label={`${platform.label} — ${t("comingSoon")}`}
                role="img"
              >
                {iconEl}
                {labelEl}
              </div>
            );
          }

          return (
            <a
              key={platform.key}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                sharedClassName,
                "hover:-translate-y-1 hover:shadow-lg",
              )}
            >
              {iconEl}
              {labelEl}
            </a>
          );
        })}
      </div>

      <p className="text-center text-xs text-[var(--text-muted)]">
        {t("footer")}
      </p>
    </div>
  );
}
