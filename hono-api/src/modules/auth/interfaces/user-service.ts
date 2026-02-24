import type { User } from './user';

export interface UserService {
  findUsers(name?: string): Promise<User[]>;
  getUserById(id: string): Promise<User | undefined>;
  createUser(data: { name: string; email: string }): Promise<User>;
  updateUser(
    id: string,
    data: Partial<{ name: string; email: string }>
  ): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
}
