export interface AnalyticsService {
  logEvent(eventName: string, params?: Record<string, unknown>): void;
  setUserId(userId: string): void;
  setUserProperties(properties: Record<string, unknown>): void;
  initialize(): void;
}
