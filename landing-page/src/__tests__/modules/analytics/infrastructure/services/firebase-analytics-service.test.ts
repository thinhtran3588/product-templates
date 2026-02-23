import { type Analytics } from 'firebase/analytics';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FirebaseAnalyticsService } from '@/modules/analytics/infrastructure/services/firebase-analytics-service';

const analyticsMocks = vi.hoisted(() => ({
  getAnalytics: vi.fn(),
  isSupported: vi.fn(),
  logEvent: vi.fn(),
  setUserId: vi.fn(),
  setUserProperties: vi.fn(),
}));

vi.mock('firebase/analytics', () => {
  return analyticsMocks;
});

const appMocks = vi.hoisted(() => ({
  initializeApp: vi.fn(),
  getApps: vi.fn(),
  FirebaseApp: vi.fn(),
}));

vi.mock('firebase/app', () => {
  return appMocks;
});

describe('FirebaseAnalyticsService', () => {
  let service: FirebaseAnalyticsService;
  const mockConfig = JSON.stringify({
    apiKey: 'test',
    authDomain: 'test',
    projectId: 'test',
  });

  const originalEnv = process.env;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_LANDING_PAGE_FIREBASE_CONFIG: mockConfig,
    };

    // Default mock setup
    appMocks.getApps.mockReturnValue([]);
    appMocks.initializeApp.mockReturnValue({});
    analyticsMocks.getAnalytics.mockReturnValue({} as Analytics);
    analyticsMocks.isSupported.mockResolvedValue(false);

    const { FirebaseAnalyticsService } =
      await import('@/modules/analytics/infrastructure/services/firebase-analytics-service');
    service = new FirebaseAnalyticsService();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('initializes firebase when supported and config exists', async () => {
    analyticsMocks.isSupported.mockResolvedValue(true);

    await service.initialize();

    expect(appMocks.initializeApp).toHaveBeenCalledWith(JSON.parse(mockConfig));
    expect(analyticsMocks.getAnalytics).toHaveBeenCalled();
  });

  it('reuses existing firebase app when already initialized', async () => {
    const existingApp = { name: 'existing' };
    appMocks.getApps.mockReturnValue([existingApp]);
    analyticsMocks.isSupported.mockResolvedValue(true);

    await service.initialize();

    expect(appMocks.initializeApp).not.toHaveBeenCalled();
    expect(analyticsMocks.getAnalytics).toHaveBeenCalledWith(existingApp);
  });

  it('does not initialize if config is missing', async () => {
    delete process.env.NEXT_PUBLIC_LANDING_PAGE_FIREBASE_CONFIG;

    await service.initialize();

    expect(appMocks.initializeApp).not.toHaveBeenCalled();
  });

  it('does not initialize if not supported', async () => {
    analyticsMocks.isSupported.mockResolvedValue(false);

    await service.initialize();

    expect(appMocks.initializeApp).not.toHaveBeenCalled();
  });

  it('logs event when initialized', async () => {
    analyticsMocks.isSupported.mockResolvedValue(true);

    await service.initialize();
    service.logEvent('test_event', { foo: 'bar' });

    expect(analyticsMocks.logEvent).toHaveBeenCalled();
  });

  it('sets user id when initialized', async () => {
    analyticsMocks.isSupported.mockResolvedValue(true);

    await service.initialize();
    service.setUserId('user_123');

    expect(analyticsMocks.setUserId).toHaveBeenCalled();
  });

  it('sets user properties when initialized', async () => {
    analyticsMocks.isSupported.mockResolvedValue(true);

    await service.initialize();
    service.setUserProperties({ role: 'admin' });

    expect(analyticsMocks.setUserProperties).toHaveBeenCalled();
  });

  it('returns early when window is undefined (SSR)', async () => {
    const originalWindow = globalThis.window;
    vi.stubGlobal('window', undefined);

    await service.initialize();

    expect(appMocks.initializeApp).not.toHaveBeenCalled();
    expect(analyticsMocks.isSupported).not.toHaveBeenCalled();

    vi.stubGlobal('window', originalWindow);
  });

  it('handles initialization errors gracefully', async () => {
    analyticsMocks.isSupported.mockResolvedValue(true);
    appMocks.initializeApp.mockImplementation(() => {
      throw new Error('Firebase init error');
    });
    appMocks.getApps.mockReturnValue([]);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await service.initialize();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to initialize Firebase Analytics',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
