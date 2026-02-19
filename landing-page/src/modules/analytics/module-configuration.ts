import { asClass, type AwilixContainer } from "awilix";

import { FirebaseAnalyticsService } from "@/modules/analytics/infrastructure/services/firebase-analytics-service";
import { LocalAnalyticsService } from "@/modules/analytics/infrastructure/services/local-analytics-service";

export function registerModule(container: AwilixContainer<object>): void {
  const useFirebase =
    typeof window !== "undefined" &&
    !!process.env.NEXT_PUBLIC_LANDING_PAGE_FIREBASE_CONFIG;

  container.register({
    analyticsService: asClass(
      useFirebase ? FirebaseAnalyticsService : LocalAnalyticsService,
    ).singleton(),
  });
}
