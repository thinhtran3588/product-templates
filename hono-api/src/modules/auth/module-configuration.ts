import { asClass } from 'awilix';
import type { ModuleConfiguration } from '@app/common/interfaces';

import { userAdapter } from './adapters/user-adapter';
import { CreateUserCommandHandler } from './application/command-handlers/create-user-command-handler';
import { DeleteUserCommandHandler } from './application/command-handlers/delete-user-command-handler';
import { UpdateUserCommandHandler } from './application/command-handlers/update-user-command-handler';
import { FindUsersQueryHandler } from './application/query-handlers/find-users-query-handler';
import { GetUserByIdQueryHandler } from './application/query-handlers/get-user-by-id-query-handler';
import { InMemoryUserRepository } from './infrastructure/repositories/in-memory-user-repository';
import type { AuthContainer } from './interfaces';

export const moduleConfiguration: ModuleConfiguration<AuthContainer> = {
  registerDependencies(container): void {
    container.register({
      userRepository: asClass(InMemoryUserRepository).singleton(),
      createUserCommandHandler: asClass(CreateUserCommandHandler).singleton(),
      updateUserCommandHandler: asClass(UpdateUserCommandHandler).singleton(),
      deleteUserCommandHandler: asClass(DeleteUserCommandHandler).singleton(),
      findUsersQueryHandler: asClass(FindUsersQueryHandler).singleton(),
      getUserByIdQueryHandler: asClass(GetUserByIdQueryHandler).singleton(),
    });
  },
  adapters: [userAdapter],
};
