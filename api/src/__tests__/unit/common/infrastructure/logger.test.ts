import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from 'vitest';
import { ConsoleLogger } from '@app/common/infrastructure/logger';

describe('ConsoleLogger', () => {
  let logger: ConsoleLogger;
  let traceSpy: MockInstance;
  let debugSpy: MockInstance;
  let infoSpy: MockInstance;
  let warnSpy: MockInstance;
  let errorSpy: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();

    traceSpy = vi.spyOn(console, 'trace').mockImplementation(() => {});
    debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    logger = new ConsoleLogger();
  });

  describe('trace', () => {
    it('should call console.trace', () => {
      logger.trace({ id: 1 }, 'test message');
      expect(traceSpy).toHaveBeenCalledWith('test message', { id: 1 });
    });
  });

  describe('debug', () => {
    it('should call console.debug', () => {
      logger.debug({ id: 1 }, 'test message');
      expect(debugSpy).toHaveBeenCalledWith('test message', { id: 1 });
    });
  });

  describe('info', () => {
    it('should call console.info', () => {
      logger.info({ id: 1 }, 'test message');
      expect(infoSpy).toHaveBeenCalledWith('test message', { id: 1 });
    });
  });

  describe('warn', () => {
    it('should call console.warn', () => {
      logger.warn({ id: 1 }, 'test message');
      expect(warnSpy).toHaveBeenCalledWith('test message', { id: 1 });
    });
  });

  describe('error', () => {
    it('should call console.error', () => {
      logger.error({ id: 1 }, 'test message');
      expect(errorSpy).toHaveBeenCalledWith('test message', { id: 1 });
    });
  });
});
