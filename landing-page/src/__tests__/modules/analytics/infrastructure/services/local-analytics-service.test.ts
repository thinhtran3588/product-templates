import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LocalAnalyticsService } from '@/modules/analytics/infrastructure/services/local-analytics-service';

describe('LocalAnalyticsService', () => {
  let service: LocalAnalyticsService;

  beforeEach(() => {
    service = new LocalAnalyticsService();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  it('initializes without error', () => {
    service.initialize();
    expect(console.log).toHaveBeenCalledWith(
      'LocalAnalyticsService initialized'
    );
  });

  it('logs event', () => {
    service.logEvent('test_event', { foo: 'bar' });
    expect(console.debug).toHaveBeenCalledWith(
      '[Analytics] Event: test_event',
      { foo: 'bar' }
    );
  });

  it('sets user id', () => {
    service.setUserId('user_123');
    expect(console.debug).toHaveBeenCalledWith(
      '[Analytics] Set User ID: user_123'
    );
  });

  it('sets user properties', () => {
    service.setUserProperties({ role: 'admin' });
    expect(console.debug).toHaveBeenCalledWith(
      '[Analytics] Set User Properties:',
      { role: 'admin' }
    );
  });
});
