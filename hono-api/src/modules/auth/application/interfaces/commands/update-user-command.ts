import type { Command } from '@app/common/interfaces';

export interface UpdateUserCommand extends Command {
  readonly id: string;
  readonly name?: string;
  readonly email?: string;
}
