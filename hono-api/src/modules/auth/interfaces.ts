import type { Context } from 'hono';

// --- Entities ---

export interface User {
  id: string;
  name: string;
  email: string;
}

// --- Services ---

export interface UserService {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | undefined>;
}

// --- Controllers ---

export interface UserController {
  getAllUsers(c: Context): Promise<Response>;
  getUser(c: Context): Promise<Response>;
}

// --- Container ---

export interface AuthContainer {
  userService: UserService;
  userController: UserController;
}
