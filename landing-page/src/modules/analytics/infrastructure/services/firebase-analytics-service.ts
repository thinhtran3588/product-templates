import {
  getAnalytics,
  isSupported,
  logEvent,
  setUserId,
  setUserProperties,
  type Analytics,
} from 'firebase/analytics';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';

import { AnalyticsService } from '../../domain/interfaces';

export class FirebaseAnalyticsService implements AnalyticsService {
  private analytics: Analytics | null = null;
  private app: FirebaseApp | null = null;

  async initialize(): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    const config = process.env.NEXT_PUBLIC_LANDING_PAGE_FIREBASE_CONFIG;
    console.log('Config present:', !!config);
    if (!config) {
      console.warn('Firebase config is missing');
      return;
    }

    try {
      console.log('Checking isSupported...');
      const supported = await isSupported();
      console.log('isSupported result:', supported);
      if (supported) {
        const firebaseConfig = JSON.parse(config);
        console.log('Initializing app...');
        this.app =
          getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        this.analytics = getAnalytics(this.app);
        console.log('Analytics initialized:', !!this.analytics);
      }
    } catch (e) {
      console.error('Failed to initialize Firebase Analytics', e);
    }
  }

  logEvent(eventName: string, params?: Record<string, unknown>): void {
    if (this.analytics) {
      logEvent(this.analytics, eventName, params);
    }
  }

  setUserId(userId: string): void {
    if (this.analytics) {
      setUserId(this.analytics, userId);
    }
  }

  setUserProperties(properties: Record<string, unknown>): void {
    if (this.analytics) {
      setUserProperties(this.analytics, properties);
    }
  }
}
