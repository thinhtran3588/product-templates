import type { CommandHandler } from '@app/common/interfaces';
import type { UserRepository } from '@app/modules/auth/domain/interfaces';
import type { UpdateUserCommand, User } from '@app/modules/auth/interfaces';

export class UpdateUserCommandHandler implements CommandHandler<
  UpdateUserCommand,
  User | undefined
> {
  private userRepository: UserRepository;

  constructor({ userRepository }: { userRepository: UserRepository }) {
    this.userRepository = userRepository;
  }

  async execute(command: UpdateUserCommand): Promise<User | undefined> {
    const { id, ...data } = command;
    return this.userRepository.update(id, data);
  }
}
