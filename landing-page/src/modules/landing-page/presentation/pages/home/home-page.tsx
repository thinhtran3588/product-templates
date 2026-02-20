import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/card";
import { PlatformDownload } from "./components/platform-download";
import { ScrollReveal } from "./components/scroll-reveal";
import { TestimonialCard } from "./components/testimonial-card";

export async function generateMetadata() {
  const t = await getTranslations("modules.landing.pages.home.hero");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

const FEATURE_KEYS = [
  "visualThinking",
  "collaboration",
  "templates",
  "crossPlatform",
  "aiAssistance",
  "export",
] as const;

const TESTIMONIAL_KEYS = ["user1", "user2", "user3"] as const;

type FeatureKey = (typeof FEATURE_KEYS)[number];
type TestimonialKey = (typeof TESTIMONIAL_KEYS)[number];

export function LandingPage() {
  const t = useTranslations("modules.landing.pages.home");

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden pt-20">
        {/* Background Orbs — uses design system glow-orb classes from globals.css */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="glow-orb h-96 w-96"
            style={{
              top: "20%",
              left: "15%",
              background: "var(--orb-1)",
            }}
          />
          <div
            className="glow-orb glow-orb-2 h-80 w-80"
            style={{
              top: "15%",
              right: "15%",
              background: "var(--orb-2)",
            }}
          />
          <div
            className="glow-orb glow-orb-3 h-72 w-72"
            style={{
              bottom: "20%",
              left: "45%",
              background: "var(--orb-3)",
            }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <ScrollReveal>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-xl backdrop-blur-sm">
              <Image
                src="/icon.svg"
                alt="App icon"
                width={48}
                height={48}
                priority
              />
            </div>
            <h1 className="mb-6 bg-gradient-to-br from-[var(--text-primary)] to-[var(--text-muted)] bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
              {t("hero.title")}
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-[var(--text-muted)] sm:text-xl">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <PlatformDownload />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 sm:py-32">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                {t("features.title")}
              </h2>
              <p className="text-lg text-[var(--text-muted)]">
                {t("features.description")}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURE_KEYS.map((feature: FeatureKey, index) => (
              <ScrollReveal key={feature} delay={index * 100}>
                <Card className="h-full p-6 transition-all hover:bg-[var(--glass-bg-strong)]">
                  <CardHeader className="p-0">
                    <CardTitle className="mb-2 text-xl">
                      {t(`features.items.${feature}.title`)}
                    </CardTitle>
                    <CardDescription>
                      {t(`features.items.${feature}.description`)}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 skew-y-3 transform bg-[var(--glass-bg)]/30" />
        <div className="relative container mx-auto px-4">
          <ScrollReveal>
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                {t("testimonials.title")}
              </h2>
              <p className="text-lg text-[var(--text-muted)]">
                {t("testimonials.description")}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIAL_KEYS.map((user: TestimonialKey, index) => (
              <ScrollReveal key={user} delay={index * 100}>
                <TestimonialCard
                  name={t(`testimonials.items.${user}.name`)}
                  role={t(`testimonials.items.${user}.role`)}
                  quote={t(`testimonials.items.${user}.quote`)}
                  delay={index * 100}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
