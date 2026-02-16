"use client";

import { useEffect } from "react";

import { initializeContainer } from "@/application/register-container";
import { getContainer, getContainerOrNull } from "@/common/utils/container";
import { type AnalyticsService } from "@/modules/analytics/domain/interfaces";

export function AppInitializer() {
  if (getContainerOrNull() === null) {
    initializeContainer();
  }

  useEffect(() => {
    const container = getContainer();
    const analyticsService =
      container.resolve<AnalyticsService>("analyticsService");
    void analyticsService.initialize();
  }, []);

  return null;
}
