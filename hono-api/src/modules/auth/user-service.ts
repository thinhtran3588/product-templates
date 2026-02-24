import { v7 as uuidv7 } from 'uuid';
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

  async findUsers(name?: string): Promise<User[]> {
    if (name) {
      this.logger.info({ name }, 'Searching users by name');
      return this.users.filter((user) =>
        user.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    this.logger.info({ count: this.users.length }, 'Fetching all users');
    return this.users;
  }

  async getUserById(id: string): Promise<User | undefined> {
    this.logger.info({ id }, 'Fetching user by id');
    return this.users.find((user) => user.id === id);
  }

  async createUser(data: { name: string; email: string }): Promise<User> {
    const newUser: User = {
      id: uuidv7(),
      ...data,
    };
    this.users.push(newUser);
    this.logger.info({ id: newUser.id }, 'User created');
    return newUser;
  }

  async updateUser(
    id: string,
    data: Partial<{ name: string; email: string }>
  ): Promise<User | undefined> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      this.logger.warn({ id }, 'User not found for update');
      return undefined;
    }

    this.users[index] = { ...this.users[index], ...data };
    this.logger.info({ id }, 'User updated');
    return this.users[index];
  }

  async deleteUser(id: string): Promise<boolean> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      this.logger.warn({ id }, 'User not found for deletion');
      return false;
    }

    this.users.splice(index, 1);
    this.logger.info({ id }, 'User deleted');
    return true;
  }
}
