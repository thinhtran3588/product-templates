import type { CommandHandler } from '@app/common/interfaces';
import type { UserRepository } from '@app/modules/auth/domain/interfaces';
import type { CreateUserCommand, User } from '@app/modules/auth/interfaces';

export class CreateUserCommandHandler implements CommandHandler<
  CreateUserCommand,
  User
> {
  private userRepository: UserRepository;

  constructor({ userRepository }: { userRepository: UserRepository }) {
    this.userRepository = userRepository;
  }

  async execute(command: CreateUserCommand): Promise<User> {
    return this.userRepository.save(command as User);
  }
}
