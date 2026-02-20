import type { AwilixContainer } from 'awilix';
import type { Container } from '@app/application/container';
import type { AppContext } from '@app/common/interfaces/context';

export type AppEnv = {
  Variables: {
    diContainer: AwilixContainer<Container>;
    appContext: AppContext;
  };
};
