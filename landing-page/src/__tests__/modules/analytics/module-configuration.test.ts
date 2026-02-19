import { createContainer } from "awilix";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("firebase/analytics", () => ({
  getAnalytics: vi.fn(),
  isSupported: vi.fn(),
  logEvent: vi.fn(),
  setUserId: vi.fn(),
  setUserProperties: vi.fn(),
}));

vi.mock("firebase/app", () => ({
  getApps: vi.fn().mockReturnValue([]),
  initializeApp: vi.fn(),
}));

describe("analytics/module-configuration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("registers FirebaseAnalyticsService when firebase config is present", async () => {
    process.env.NEXT_PUBLIC_LANDING_PAGE_FIREBASE_CONFIG = JSON.stringify({
      apiKey: "test",
    });

    const { registerModule } =
      await import("@/modules/analytics/module-configuration");
    const container = createContainer();
    registerModule(container);

    const service = container.resolve("analyticsService");
    expect(service.constructor.name).toBe("FirebaseAnalyticsService");
  });

  it("registers LocalAnalyticsService when firebase config is absent", async () => {
    delete process.env.NEXT_PUBLIC_LANDING_PAGE_FIREBASE_CONFIG;

    const { registerModule } =
      await import("@/modules/analytics/module-configuration");
    const container = createContainer();
    registerModule(container);

    const service = container.resolve("analyticsService");
    expect(service.constructor.name).toBe("LocalAnalyticsService");
  });
});
