import type { Command } from '@app/common/interfaces';

export interface DeleteUserCommand extends Command {
  readonly id: string;
}
