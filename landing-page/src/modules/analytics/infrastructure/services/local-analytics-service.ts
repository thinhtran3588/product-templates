import { AnalyticsService } from '../../domain/interfaces';

export class LocalAnalyticsService implements AnalyticsService {
  initialize(): void {
    console.log('LocalAnalyticsService initialized');
  }

  logEvent(eventName: string, params?: Record<string, unknown>): void {
    console.debug(`[Analytics] Event: ${eventName}`, params);
  }

  setUserId(userId: string): void {
    console.debug(`[Analytics] Set User ID: ${userId}`);
  }

  setUserProperties(properties: Record<string, unknown>): void {
    console.debug(`[Analytics] Set User Properties:`, properties);
  }
}
