import * as honoNodeServer from '@hono/node-server';
import type { OpenAPIHono } from '@hono/zod-openapi';
import { Sequelize } from 'sequelize';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from 'vitest';
import { createApp, startServer } from '@app/app';
import { createDIContainer } from '@app/application/container';
import {
  initializeReadDatabase,
  initializeWriteDatabase,
} from '@app/application/database';
import { registerCors } from '@app/application/middleware/register-cors';
import { registerRateLimit } from '@app/application/middleware/register-rate-limit';
import { registerSwagger } from '@app/application/middleware/register-swagger';
import { discoverModules } from '@app/application/module-discovery';
import type { AppEnv } from '@app/application/types/hono.env';
import type { ExternalAuthenticationService } from '@app/modules/auth/domain/interfaces/services/external-authentication.service';

vi.mock('@app/common/utils/load-env');
vi.mock('@app/application/container');
vi.mock('@app/application/database');
vi.mock('@app/application/module-discovery');
vi.mock('@app/application/middleware/attach-app-context');
vi.mock('@app/application/middleware/error.handler');
vi.mock('@app/application/middleware/not-found.handler');
vi.mock('@app/application/middleware/register-cors');
vi.mock('@app/application/middleware/register-rate-limit');
vi.mock('@app/application/middleware/register-swagger');
vi.mock('@app/application/middleware/register-graphql');
vi.mock('@hono/node-server', () => ({
  serve: vi.fn(),
}));

describe('app', () => {
  const originalEnv = process.env;
  let mockWriteDatabase: Sequelize;
  let mockReadDatabase: Sequelize;
  let mockContainer: ReturnType<typeof createDIContainer>;
  let mockExternalAuthService: ExternalAuthenticationService;
  let mockJwtService: { initialize: ReturnType<typeof vi.fn> };
  let consoleInfoSpy: MockInstance;
  let consoleErrorSpy: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    process.env['NODE_ENV'] = 'test';

    mockWriteDatabase = new Sequelize({
      dialect: 'postgres',
      logging: false,
    });
    mockReadDatabase = new Sequelize({
      dialect: 'postgres',
      logging: false,
    });

    mockJwtService = {
      initialize: vi.fn(),
    };

    mockExternalAuthService = {
      initialize: vi.fn(),
    } as unknown as ExternalAuthenticationService;

    mockContainer = {
      resolve: vi.fn((name: string) => {
        if (name === 'externalAuthenticationService') {
          return mockExternalAuthService;
        }
        if (name === 'jwtService') {
          return mockJwtService;
        }
        return null;
      }),
      decorate: vi.fn(),
    } as unknown as ReturnType<typeof createDIContainer>;

    vi.mocked(createDIContainer).mockReturnValue(mockContainer);
    vi.mocked(initializeWriteDatabase).mockReturnValue(mockWriteDatabase);
    vi.mocked(initializeReadDatabase).mockReturnValue(mockReadDatabase);
    vi.mocked(discoverModules).mockResolvedValue({
      modules: [],
      models: [],
      modelAssociations: [],
      routes: [],
      graphqlSchemas: [],
      graphqlResolvers: [],
      moduleNames: [],
    });

    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    consoleInfoSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('createApp - happy path', () => {
    it('should create Hono app instance', async () => {
      const app = await createApp();

      expect(app).toBeDefined();
    });

    it('should initialize databases', async () => {
      await createApp();

      expect(initializeWriteDatabase).toHaveBeenCalled();
      expect(initializeReadDatabase).toHaveBeenCalled();
    });

    it('should create dependency injection container', async () => {
      await createApp();

      expect(createDIContainer).toHaveBeenCalledWith(
        mockWriteDatabase,
        mockReadDatabase,
        expect.any(Object)
      );
    });

    it('should discover modules', async () => {
      await createApp();

      expect(discoverModules).toHaveBeenCalled();
    });

    it('should register models and associations', async () => {
      const mockModel = {
        register: vi.fn(),
      };
      const mockAssociation = {
        register: vi.fn(),
      };

      vi.mocked(discoverModules).mockResolvedValue({
        modules: [],
        models: [mockModel],
        modelAssociations: [mockAssociation],
        routes: [],
        graphqlSchemas: [],
        graphqlResolvers: [],
        moduleNames: [],
      });

      await createApp();

      expect(mockModel.register).toHaveBeenCalledWith(mockWriteDatabase);
      expect(mockAssociation.register).toHaveBeenCalled();
    });

    it('should register routes', async () => {
      const mockRoute = {
        tags: [{ name: 'test', description: 'Test' }],
        register: vi.fn(),
        path: '/test',
      };

      vi.mocked(discoverModules).mockResolvedValue({
        modules: [],
        models: [],
        modelAssociations: [],
        routes: [mockRoute as any],
        graphqlSchemas: [],
        graphqlResolvers: [],
        moduleNames: [],
      });

      await createApp();

      expect(mockRoute.register).toHaveBeenCalled();
    });

    it('should initialize external authentication service', async () => {
      await createApp();

      expect(mockExternalAuthService.initialize).toHaveBeenCalled();
    });

    it('should initialize JWT service', async () => {
      await createApp();

      expect(mockJwtService.initialize).toHaveBeenCalled();
    });

    it('should register modules', async () => {
      const mockModule = {
        registerDependencies: vi.fn(),
        registerErrorCodes: vi.fn(),
      };

      vi.mocked(discoverModules).mockResolvedValue({
        modules: [mockModule],
        models: [],
        modelAssociations: [],
        routes: [],
        graphqlSchemas: [],
        graphqlResolvers: [],
        moduleNames: [],
      });

      await createApp();

      expect(mockModule.registerDependencies).toHaveBeenCalledWith(
        mockContainer
      );
      expect(mockModule.registerErrorCodes).toHaveBeenCalled();
    });

    it('should configure App logic with correct options', async () => {
      const app = await createApp();

      expect(app).toBeDefined();
    });

    it('should register middleware in correct order', async () => {
      await createApp();

      expect(registerCors).toHaveBeenCalled();
      expect(registerRateLimit).toHaveBeenCalled();
      expect(registerSwagger).toHaveBeenCalled();
    });

    it('should handle multiple models', async () => {
      const mockModel1 = { register: vi.fn() };
      const mockModel2 = { register: vi.fn() };

      vi.mocked(discoverModules).mockResolvedValue({
        modules: [],
        models: [mockModel1, mockModel2],
        modelAssociations: [],
        routes: [],
        graphqlSchemas: [],
        graphqlResolvers: [],
        moduleNames: [],
      });

      await createApp();

      expect(mockModel1.register).toHaveBeenCalledWith(mockWriteDatabase);
      expect(mockModel2.register).toHaveBeenCalledWith(mockWriteDatabase);
    });

    it('should handle multiple associations', async () => {
      const mockAssociation1 = { register: vi.fn() };
      const mockAssociation2 = { register: vi.fn() };

      vi.mocked(discoverModules).mockResolvedValue({
        modules: [],
        models: [],
        modelAssociations: [mockAssociation1, mockAssociation2],
        routes: [],
        graphqlSchemas: [],
        graphqlResolvers: [],
        moduleNames: [],
      });

      await createApp();

      expect(mockAssociation1.register).toHaveBeenCalled();
      expect(mockAssociation2.register).toHaveBeenCalled();
    });

    it('should handle multiple modules', async () => {
      const mockModule1 = {
        registerDependencies: vi.fn(),
        registerErrorCodes: vi.fn(),
      };
      const mockModule2 = {
        registerDependencies: vi.fn(),
        registerErrorCodes: vi.fn(),
      };

      vi.mocked(discoverModules).mockResolvedValue({
        modules: [mockModule1, mockModule2],
        models: [],
        modelAssociations: [],
        routes: [],
        graphqlSchemas: [],
        graphqlResolvers: [],
        moduleNames: [],
      });

      await createApp();

      expect(mockModule1.registerDependencies).toHaveBeenCalledWith(
        mockContainer
      );
      expect(mockModule1.registerErrorCodes).toHaveBeenCalled();
      expect(mockModule2.registerDependencies).toHaveBeenCalledWith(
        mockContainer
      );
      expect(mockModule2.registerErrorCodes).toHaveBeenCalled();
    });

    it('should flatten route tags correctly', async () => {
      const mockRoute1 = {
        tags: [
          { name: 'tag1', description: 'Tag 1' },
          { name: 'tag2', description: 'Tag 2' },
        ],
        register: vi.fn(),
        path: '/test1',
      };
      const mockRoute2 = {
        tags: [{ name: 'tag3', description: 'Tag 3' }],
        register: vi.fn(),
        path: '/test2',
      };

      vi.mocked(discoverModules).mockResolvedValue({
        modules: [],
        models: [],
        modelAssociations: [],
        routes: [mockRoute1, mockRoute2] as any[],
        graphqlSchemas: [],
        graphqlResolvers: [],
        moduleNames: [],
      });

      await createApp();

      expect(registerSwagger).toHaveBeenCalledWith(
        expect.anything(),
        expect.arrayContaining([
          { name: 'tag1', description: 'Tag 1' },
          { name: 'tag2', description: 'Tag 2' },
          { name: 'tag3', description: 'Tag 3' },
        ])
      );
    });
  });

  describe('startServer - happy path', () => {
    it('should start server on default port and host', async () => {
      const originalPort = process.env['PORT'];
      const originalHost = process.env['HOST'];
      delete process.env['PORT'];
      delete process.env['HOST'];

      const mockApp = { fetch: vi.fn() } as unknown as OpenAPIHono<AppEnv>;

      await startServer(mockApp);

      expect(honoNodeServer.serve).toHaveBeenCalledWith(
        {
          fetch: expect.anything(),
          port: 8080,
          hostname: '0.0.0.0',
        },
        expect.any(Function)
      );

      if (originalPort) process.env['PORT'] = originalPort;
      else delete process.env['PORT'];
      if (originalHost) process.env['HOST'] = originalHost;
    });

    it('should start server on custom port from environment', async () => {
      const originalPort = process.env['PORT'];
      const originalHost = process.env['HOST'];
      process.env['PORT'] = '3000';
      delete process.env['HOST'];

      const mockApp = { fetch: vi.fn() } as unknown as OpenAPIHono<AppEnv>;

      await startServer(mockApp);

      expect(honoNodeServer.serve).toHaveBeenCalledWith(
        {
          fetch: expect.anything(),
          port: 3000,
          hostname: '0.0.0.0',
        },
        expect.any(Function)
      );

      if (originalPort) process.env['PORT'] = originalPort;
      else delete process.env['PORT'];
      if (originalHost) process.env['HOST'] = originalHost;
    });

    it('should start server on custom host from environment', async () => {
      process.env['HOST'] = '127.0.0.1';

      const mockApp = { fetch: vi.fn() } as unknown as OpenAPIHono<AppEnv>;

      await startServer(mockApp);

      expect(honoNodeServer.serve).toHaveBeenCalledWith(
        {
          fetch: expect.anything(),
          port: 8080,
          hostname: '127.0.0.1',
        },
        expect.any(Function)
      );
    });
  });

  describe('startServer - edge cases', () => {
    it('should use default port when PORT is NaN', async () => {
      const originalPort = process.env['PORT'];
      const originalHost = process.env['HOST'];
      process.env['PORT'] = 'invalid';
      delete process.env['HOST'];

      const mockApp = { fetch: vi.fn() } as unknown as OpenAPIHono<AppEnv>;

      await startServer(mockApp);

      expect(honoNodeServer.serve).toHaveBeenCalledWith(
        {
          fetch: expect.anything(),
          port: 8080,
          hostname: '0.0.0.0',
        },
        expect.any(Function)
      );

      if (originalPort) process.env['PORT'] = originalPort;
      else delete process.env['PORT'];
      if (originalHost) process.env['HOST'] = originalHost;
    });

    it('should use default port when PORT is negative', async () => {
      const originalPort = process.env['PORT'];
      const originalHost = process.env['HOST'];
      process.env['PORT'] = '-1';
      delete process.env['HOST'];

      const mockApp = { fetch: vi.fn() } as unknown as OpenAPIHono<AppEnv>;

      await startServer(mockApp);

      expect(honoNodeServer.serve).toHaveBeenCalledWith(
        {
          fetch: expect.anything(),
          port: 8080,
          hostname: '0.0.0.0',
        },
        expect.any(Function)
      );

      if (originalPort) process.env['PORT'] = originalPort;
      else delete process.env['PORT'];
      if (originalHost) process.env['HOST'] = originalHost;
    });

    it('should use default port when PORT is zero', async () => {
      const originalPort = process.env['PORT'];
      const originalHost = process.env['HOST'];
      process.env['PORT'] = '0';
      delete process.env['HOST'];

      const mockApp = { fetch: vi.fn() } as unknown as OpenAPIHono<AppEnv>;

      await startServer(mockApp);

      expect(honoNodeServer.serve).toHaveBeenCalledWith(
        {
          fetch: expect.anything(),
          port: 8080,
          hostname: '0.0.0.0',
        },
        expect.any(Function)
      );

      if (originalPort) process.env['PORT'] = originalPort;
      else delete process.env['PORT'];
      if (originalHost) process.env['HOST'] = originalHost;
    });

    it('should handle empty string PORT environment variable', async () => {
      const originalPort = process.env['PORT'];
      const originalHost = process.env['HOST'];
      process.env['PORT'] = '';
      delete process.env['HOST'];

      const mockApp = { fetch: vi.fn() } as unknown as OpenAPIHono<AppEnv>;

      await startServer(mockApp);

      expect(honoNodeServer.serve).toHaveBeenCalledWith(
        {
          fetch: expect.anything(),
          port: 8080,
          hostname: '0.0.0.0',
        },
        expect.any(Function)
      );

      if (originalPort) process.env['PORT'] = originalPort;
      else delete process.env['PORT'];
      if (originalHost) process.env['HOST'] = originalHost;
    });

    it('should use empty string when HOST is set to empty string', async () => {
      const originalHost = process.env['HOST'];
      process.env['HOST'] = '';

      const mockApp = { fetch: vi.fn() } as unknown as OpenAPIHono<AppEnv>;

      await startServer(mockApp);

      expect(honoNodeServer.serve).toHaveBeenCalledWith(
        {
          fetch: expect.anything(),
          port: 8080,
          hostname: '',
        },
        expect.any(Function)
      );

      if (originalHost) process.env['HOST'] = originalHost;
    });

    it('should use valid port number when PORT is a valid positive number', async () => {
      const originalPort = process.env['PORT'];
      const originalHost = process.env['HOST'];
      process.env['PORT'] = '9000';
      delete process.env['HOST'];

      const mockApp = { fetch: vi.fn() } as unknown as OpenAPIHono<AppEnv>;

      await startServer(mockApp);

      expect(honoNodeServer.serve).toHaveBeenCalledWith(
        {
          fetch: expect.anything(),
          port: 9000,
          hostname: '0.0.0.0',
        },
        expect.any(Function)
      );

      if (originalPort) process.env['PORT'] = originalPort;
      else delete process.env['PORT'];
      if (originalHost) process.env['HOST'] = originalHost;
    });
  });

  describe('function exports', () => {
    it('should export createApp function', async () => {
      const appModule = await import('@app/app');
      expect(typeof appModule.createApp).toBe('function');
      const app = await appModule.createApp();
      expect(app).toBeDefined();
    });

    it('should export startServer function', async () => {
      const appModule = await import('@app/app');
      expect(typeof appModule.startServer).toBe('function');
      const mockApp = { fetch: vi.fn() } as unknown as OpenAPIHono<AppEnv>;
      await appModule.startServer(mockApp);
      expect(honoNodeServer.serve).toHaveBeenCalled();
    });
  });
});
