import type { AppContext } from '@app/common/interfaces';

export interface UserController {
  findUsers(c: AppContext): Promise<Response>;
  getUser(c: AppContext): Promise<Response>;
  createUser(c: AppContext): Promise<Response>;
  updateUser(c: AppContext): Promise<Response>;
  deleteUser(c: AppContext): Promise<Response>;
}
