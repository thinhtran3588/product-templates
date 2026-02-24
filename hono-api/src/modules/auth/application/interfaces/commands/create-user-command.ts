import type { Command } from '@app/common/interfaces';

export interface CreateUserCommand extends Command {
  readonly name: string;
  readonly email: string;
}
