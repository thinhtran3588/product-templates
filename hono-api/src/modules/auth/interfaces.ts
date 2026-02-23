import type { AppContext } from '@app/common/interfaces';

// --- Entities ---

export interface User {
  id: string;
  name: string;
  email: string;
}

// --- Services ---

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

// --- Controllers ---

export interface UserController {
  findUsers(c: AppContext): Promise<Response>;
  getUser(c: AppContext): Promise<Response>;
  createUser(c: AppContext): Promise<Response>;
  updateUser(c: AppContext): Promise<Response>;
  deleteUser(c: AppContext): Promise<Response>;
}

// --- Container ---

export interface AuthContainer {
  userService: UserService;
  userController: UserController;
}
