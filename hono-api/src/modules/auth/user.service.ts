import type { Logger } from '@app/common/interfaces';

import type { User, UserService } from './interfaces';

export class UserServiceImpl implements UserService {
  private readonly logger: Logger;

  private users: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
  ];

  constructor({ logger }: { logger: Logger }) {
    this.logger = logger;
  }

  async getUsers(): Promise<User[]> {
    this.logger.info({ users: this.users }, 'Fetching all users');
    throw new Error('Error fetching users');
    return Promise.resolve(this.users);
  }

  async getUserById(id: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find((user) => user.id === id));
  }
}
