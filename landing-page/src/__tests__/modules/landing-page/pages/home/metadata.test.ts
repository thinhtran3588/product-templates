import { describe, expect, it, vi } from "vitest";

import { generateMetadata } from "@/modules/landing-page/presentation/pages/home/home-page";

vi.mock("next-intl/server", () => ({
  getTranslations: () => Promise.resolve((key: string) => key),
}));

describe("LandingPage Metadata", () => {
  it("generates metadata with correct title and description", async () => {
    const metadata = await generateMetadata();

    expect(metadata).toEqual({
      title: "title",
      description: "subtitle",
    });
  });
});
