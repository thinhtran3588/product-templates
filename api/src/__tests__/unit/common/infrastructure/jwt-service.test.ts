import { generateKeyPairSync } from 'crypto';
import jwt from 'jsonwebtoken';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JwtService } from '@app/common/infrastructure/jwt-service';

const ORIGINAL_ENV = {
  JWT_PRIVATE_KEY: process.env['JWT_PRIVATE_KEY'],
  JWT_PUBLIC_KEY: process.env['JWT_PUBLIC_KEY'],
  JWT_ISSUER: process.env['JWT_ISSUER'],
  JWT_ACCESS_TOKEN_EXPIRES_IN: process.env['JWT_ACCESS_TOKEN_EXPIRES_IN'],
  FIREBASE_SERVICE_ACCOUNT_JSON: process.env['FIREBASE_SERVICE_ACCOUNT_JSON'],
};

describe('JwtService', () => {
  beforeEach(() => {
    delete process.env['JWT_PRIVATE_KEY'];
    delete process.env['JWT_PUBLIC_KEY'];
    delete process.env['JWT_ISSUER'];
    delete process.env['JWT_ACCESS_TOKEN_EXPIRES_IN'];
    delete process.env['FIREBASE_SERVICE_ACCOUNT_JSON'];
  });

  afterEach(() => {
    process.env['JWT_PRIVATE_KEY'] = ORIGINAL_ENV.JWT_PRIVATE_KEY;
    process.env['JWT_PUBLIC_KEY'] = ORIGINAL_ENV.JWT_PUBLIC_KEY;
    process.env['JWT_ISSUER'] = ORIGINAL_ENV.JWT_ISSUER;
    process.env['JWT_ACCESS_TOKEN_EXPIRES_IN'] =
      ORIGINAL_ENV.JWT_ACCESS_TOKEN_EXPIRES_IN;
    process.env['FIREBASE_SERVICE_ACCOUNT_JSON'] =
      ORIGINAL_ENV.FIREBASE_SERVICE_ACCOUNT_JSON;
  });

  it('throws initialize when no key source is provided', () => {
    const service = new JwtService();
    expect(() => service.initialize()).toThrow(
      'Either JWT_PRIVATE_KEY or FIREBASE_SERVICE_ACCOUNT_JSON'
    );
  });

  it('initializes from service account json when private key env is missing', () => {
    const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    process.env['FIREBASE_SERVICE_ACCOUNT_JSON'] = JSON.stringify({
      private_key: privateKey
        .export({ type: 'pkcs1', format: 'pem' })
        .toString(),
    });

    const service = new JwtService();
    expect(() => service.initialize()).not.toThrow();
  });

  it('throws when service account json does not contain private_key', () => {
    process.env['FIREBASE_SERVICE_ACCOUNT_JSON'] = JSON.stringify({});
    const service = new JwtService();
    expect(() => service.initialize()).toThrow(
      'Private key not found in service account'
    );
  });

  it('throws when private key cannot derive public key', () => {
    process.env['JWT_PRIVATE_KEY'] = 'invalid-private-key';
    const service = new JwtService();
    expect(() => service.initialize()).toThrow(
      'Failed to derive public key from private key'
    );
  });

  it('returns early when already initialized', () => {
    const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    process.env['JWT_PRIVATE_KEY'] = privateKey
      .export({ type: 'pkcs1', format: 'pem' })
      .toString();

    const service = new JwtService();
    service.initialize();
    expect(() => service.initialize()).not.toThrow();
  });

  it('uses configured JWT_ACCESS_TOKEN_EXPIRES_IN when provided', () => {
    const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    process.env['JWT_PRIVATE_KEY'] = privateKey
      .export({ type: 'pkcs1', format: 'pem' })
      .toString();
    process.env['JWT_ISSUER'] = 'test-issuer';
    process.env['JWT_ACCESS_TOKEN_EXPIRES_IN'] = '30m';

    const service = new JwtService();
    service.initialize();
    expect(() => service.signToken({ userId: 'u1', roles: [] })).not.toThrow();
  });

  it('keeps existing publicKey when already set before initialize', () => {
    const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    process.env['JWT_PRIVATE_KEY'] = privateKey
      .export({ type: 'pkcs1', format: 'pem' })
      .toString();

    const service = new JwtService();
    Object.defineProperty(service as object, 'publicKey', {
      value: 'preconfigured-public-key',
      writable: true,
      configurable: true,
    });
    service.initialize();

    expect((service as unknown as { publicKey: string }).publicKey).toBe(
      'preconfigured-public-key'
    );
  });

  it('signs and verifies token after initialize', () => {
    const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    process.env['JWT_PRIVATE_KEY'] = privateKey
      .export({ type: 'pkcs1', format: 'pem' })
      .toString();
    process.env['JWT_ISSUER'] = 'test-issuer';

    const service = new JwtService();
    service.initialize();

    const token = service.signToken({ userId: 'u1', roles: ['ADMIN'] });
    const payload = service.verifyToken(token);

    expect(payload.userId).toBe('u1');
    expect(payload.roles).toEqual(['ADMIN']);
  });

  it('throws for invalid token', () => {
    const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    process.env['JWT_PRIVATE_KEY'] = privateKey
      .export({ type: 'pkcs1', format: 'pem' })
      .toString();
    process.env['JWT_ISSUER'] = 'test-issuer';

    const service = new JwtService();
    service.initialize();

    expect(() => service.verifyToken('invalid')).toThrow('Invalid token');
  });

  it('throws when sign/verify called before initialize', () => {
    const service = new JwtService();
    expect(() => service.signToken({ userId: 'u1', roles: [] })).toThrow(
      'JWT service not initialized'
    );
    expect(() => service.verifyToken('token')).toThrow(
      'JWT service not initialized'
    );
  });

  it('throws when verified token is missing userId', () => {
    const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    process.env['JWT_PRIVATE_KEY'] = privateKey
      .export({ type: 'pkcs1', format: 'pem' })
      .toString();
    process.env['JWT_ISSUER'] = 'test-issuer';

    const service = new JwtService();
    service.initialize();
    const token = service.signToken({ roles: ['ADMIN'] } as never);

    expect(() => service.verifyToken(token)).toThrow(
      'Token payload missing userId'
    );
  });

  it('maps TokenExpiredError and NotBeforeError from verifier', () => {
    const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    process.env['JWT_PRIVATE_KEY'] = privateKey
      .export({ type: 'pkcs1', format: 'pem' })
      .toString();
    process.env['JWT_ISSUER'] = 'test-issuer';

    const service = new JwtService();
    service.initialize();

    const verifySpy = vi.spyOn(jwt, 'verify');
    verifySpy.mockImplementationOnce(() => {
      const error = new Error('expired');
      Object.defineProperty(error, 'name', { value: 'TokenExpiredError' });
      throw error;
    });
    expect(() => service.verifyToken('token')).toThrow('Token expired');

    verifySpy.mockImplementationOnce(() => {
      const error = new Error('not-active');
      Object.defineProperty(error, 'name', { value: 'NotBeforeError' });
      throw error;
    });
    expect(() => service.verifyToken('token')).toThrow('Token not active');

    verifySpy.mockRestore();
  });

  it('maps TokenExpiredError and NotBeforeError when error is Error instance', () => {
    const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    process.env['JWT_PRIVATE_KEY'] = privateKey
      .export({ type: 'pkcs1', format: 'pem' })
      .toString();
    process.env['JWT_ISSUER'] = 'test-issuer';

    const service = new JwtService();
    service.initialize();

    const verifySpy = vi.spyOn(jwt, 'verify');
    verifySpy.mockImplementationOnce(() => {
      const err = new Error('expired');
      Object.defineProperty(err, 'name', { value: 'TokenExpiredError' });
      throw err;
    });
    expect(() => service.verifyToken('token')).toThrow(
      'Token expired: expired'
    );

    verifySpy.mockImplementationOnce(() => {
      const err = new Error('not-active');
      Object.defineProperty(err, 'name', { value: 'NotBeforeError' });
      throw err;
    });
    expect(() => service.verifyToken('token')).toThrow(
      'Token not active: not-active'
    );

    verifySpy.mockRestore();
  });

  it('uses JWT_PUBLIC_KEY when provided and maps all jwt error branches', () => {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });
    process.env['JWT_PRIVATE_KEY'] = privateKey
      .export({ type: 'pkcs1', format: 'pem' })
      .toString();
    process.env['JWT_PUBLIC_KEY'] = publicKey
      .export({ type: 'spki', format: 'pem' })
      .toString();
    process.env['JWT_ISSUER'] = 'test-issuer';

    const service = new JwtService();
    service.initialize();

    const verifySpy = vi.spyOn(jwt, 'verify');
    verifySpy.mockImplementationOnce(() => {
      const error = new Error('jwt-invalid');
      Object.defineProperty(error, 'name', { value: 'JsonWebTokenError' });
      throw error;
    });
    expect(() => service.verifyToken('token')).toThrow('Invalid token');

    verifySpy.mockImplementationOnce(() => {
      const error = new Error('expired');
      Object.defineProperty(error, 'name', { value: 'TokenExpiredError' });
      throw error;
    });
    expect(() => service.verifyToken('token')).toThrow('Token expired');

    verifySpy.mockImplementationOnce(() => {
      const error = new Error('not-active');
      Object.defineProperty(error, 'name', { value: 'NotBeforeError' });
      throw error;
    });
    expect(() => service.verifyToken('token')).toThrow('Token not active');

    verifySpy.mockRestore();
  });

  it('defaults roles to empty array when missing in token payload', () => {
    const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    process.env['JWT_PRIVATE_KEY'] = privateKey
      .export({ type: 'pkcs1', format: 'pem' })
      .toString();
    process.env['JWT_ISSUER'] = 'test-issuer';

    const service = new JwtService();
    service.initialize();
    const token = service.signToken({ userId: 'u-no-roles' } as never);

    expect(service.verifyToken(token)).toEqual({
      userId: 'u-no-roles',
      roles: [],
    });
  });

  it('uses Unknown error message fallback for non-Error jwt errors', () => {
    const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    process.env['JWT_PRIVATE_KEY'] = privateKey
      .export({ type: 'pkcs1', format: 'pem' })
      .toString();
    process.env['JWT_ISSUER'] = 'test-issuer';

    const service = new JwtService();
    service.initialize();
    const verifySpy = vi.spyOn(jwt, 'verify');

    verifySpy.mockImplementationOnce(() => {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw { name: 'JsonWebTokenError' };
    });
    expect(() => service.verifyToken('token')).toThrow(
      'Invalid token: Unknown error'
    );

    verifySpy.mockImplementationOnce(() => {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw { name: 'TokenExpiredError' };
    });
    expect(() => service.verifyToken('token')).toThrow(
      'Token expired: Unknown error'
    );

    verifySpy.mockImplementationOnce(() => {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw { name: 'NotBeforeError' };
    });
    expect(() => service.verifyToken('token')).toThrow(
      'Token not active: Unknown error'
    );

    verifySpy.mockRestore();
  });
});
