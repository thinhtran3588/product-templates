import { v7 as uuidv7 } from 'uuid';
import type { Logger } from '@app/common/interfaces';

import type { User } from '../../domain/aggregates/user';
import type { UserRepository } from '../../domain/interfaces';

export class InMemoryUserRepository implements UserRepository {
  private readonly logger: Logger;
  private users: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
  ];

  constructor({ logger }: { logger: Logger }) {
    this.logger = logger;
  }

  findAll(filters?: { name?: string }): Promise<User[]> {
    if (filters?.name) {
      this.logger.info({ name: filters.name }, 'Searching users by name');
      return Promise.resolve(
        this.users.filter((user) =>
          user.name.toLowerCase().includes(filters.name!.toLowerCase())
        )
      );
    }
    this.logger.info({ count: this.users.length }, 'Fetching all users');
    return Promise.resolve(this.users);
  }

  findById(id: string): Promise<User | undefined> {
    this.logger.info({ id }, 'Fetching user by id');
    return Promise.resolve(this.users.find((user) => user.id === id));
  }

  save(user: User): Promise<User> {
    const newUser = { ...user, id: user.id || uuidv7() };
    this.users.push(newUser);
    this.logger.info({ id: newUser.id }, 'User saved to memory');
    return Promise.resolve(newUser);
  }

  update(id: string, data: Partial<User>): Promise<User | undefined> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return Promise.resolve(undefined);

    this.users[index] = { ...this.users[index], ...data };
    this.logger.info({ id }, 'User updated in memory');
    return Promise.resolve(this.users[index]);
  }

  delete(id: string): Promise<boolean> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return Promise.resolve(false);

    this.users.splice(index, 1);
    this.logger.info({ id }, 'User deleted from memory');
    return Promise.resolve(true);
  }
}
