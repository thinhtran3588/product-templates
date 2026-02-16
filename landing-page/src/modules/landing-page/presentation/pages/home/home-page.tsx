import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/card";
import { BrainIcon } from "@/common/components/icons";
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

export function LandingPage() {
  const t = useTranslations("modules.landing.pages.home");

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden pt-20">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0">
          <div className="animate-blob absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-500/20 mix-blend-multiply blur-3xl filter" />
          <div className="animate-blob animation-delay-2000 absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/20 mix-blend-multiply blur-3xl filter" />
          <div className="animate-blob animation-delay-4000 absolute bottom-1/4 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-pink-500/20 mix-blend-multiply blur-3xl filter" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <ScrollReveal>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 shadow-xl backdrop-blur-sm">
              <BrainIcon className="h-10 w-10 text-blue-500" />
            </div>
            <h1 className="mb-6 bg-gradient-to-br from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
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
            {[
              "visualThinking",
              "collaboration",
              "templates",
              "crossPlatform",
              "aiAssistance",
              "export",
            ].map((feature, index) => (
              <ScrollReveal key={feature} delay={index * 100}>
                <Card className="h-full p-6 transition-all hover:bg-[var(--surface-primary)]">
                  <CardHeader className="p-0">
                    <CardTitle className="mb-2 text-xl">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {t(`features.items.${feature}.title` as any)}
                    </CardTitle>
                    <CardDescription>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {t(`features.items.${feature}.description` as any)}
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
        <div className="absolute inset-0 skew-y-3 transform bg-[var(--surface-secondary)]/30" />
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
            {["user1", "user2", "user3"].map((user, index) => (
              <ScrollReveal key={user} delay={index * 100}>
                <TestimonialCard
                  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                  name={t(`testimonials.items.${user}.name` as any)}
                  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                  role={t(`testimonials.items.${user}.role` as any)}
                  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                  quote={t(`testimonials.items.${user}.quote` as any)}
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
