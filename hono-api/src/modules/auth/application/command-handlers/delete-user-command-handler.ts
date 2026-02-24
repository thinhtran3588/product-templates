import type { CommandHandler } from '@app/common/interfaces';
import type { UserRepository } from '@app/modules/auth/domain/interfaces';
import type { DeleteUserCommand } from '@app/modules/auth/interfaces';

export class DeleteUserCommandHandler implements CommandHandler<
  DeleteUserCommand,
  boolean
> {
  private userRepository: UserRepository;

  constructor({ userRepository }: { userRepository: UserRepository }) {
    this.userRepository = userRepository;
  }

  async execute(command: DeleteUserCommand): Promise<boolean> {
    return this.userRepository.delete(command.id);
  }
}
