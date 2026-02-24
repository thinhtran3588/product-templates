import { asClass } from 'awilix';
import type { ModuleConfiguration } from '@app/common/interfaces';

import { userAdapter } from './adapters/user.adapter';
import { UserControllerImpl } from './user.controller';
import { UserServiceImpl } from './user.service';

export const moduleConfiguration: ModuleConfiguration = {
  registerDependencies(container): void {
    container.register({
      userService: asClass(UserServiceImpl).singleton(),
      userController: asClass(UserControllerImpl).singleton(),
    });
  },
  adapters: [userAdapter],
};
