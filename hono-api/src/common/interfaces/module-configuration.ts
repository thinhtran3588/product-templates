import type { AwilixContainer } from 'awilix';

import type { AdapterConfiguration } from './adapter-configuration';

export interface ModuleConfiguration {
  registerDependencies(container: AwilixContainer<any>): void;
  adapters: AdapterConfiguration[];
}
