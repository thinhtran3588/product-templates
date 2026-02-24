import type { User } from '../../aggregates/user';

export interface UserRepository {
  findAll(filters?: { name?: string }): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  save(user: User): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User | undefined>;
  delete(id: string): Promise<boolean>;
}
