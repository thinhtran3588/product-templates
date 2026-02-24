import type { CreateUserCommandHandler } from '../application/command-handlers/create-user-command-handler';
import type { DeleteUserCommandHandler } from '../application/command-handlers/delete-user-command-handler';
import type { UpdateUserCommandHandler } from '../application/command-handlers/update-user-command-handler';
import type { FindUsersQueryHandler } from '../application/query-handlers/find-users-query-handler';
import type { GetUserByIdQueryHandler } from '../application/query-handlers/get-user-by-id-query-handler';
import type { UserRepository } from '../domain/interfaces/repositories/user-repository';

export interface AuthContainer {
  userRepository: UserRepository;
  createUserCommandHandler: CreateUserCommandHandler;
  updateUserCommandHandler: UpdateUserCommandHandler;
  deleteUserCommandHandler: DeleteUserCommandHandler;
  findUsersQueryHandler: FindUsersQueryHandler;
  getUserByIdQueryHandler: GetUserByIdQueryHandler;
}
