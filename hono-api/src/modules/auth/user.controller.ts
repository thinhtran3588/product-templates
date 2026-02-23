import type { Context } from 'hono';

import type { AuthContainer, UserController } from './interfaces';

export class UserControllerImpl implements UserController {
  private userService: AuthContainer['userService'];

  constructor({ userService }: AuthContainer) {
    this.userService = userService;
  }

  async getAllUsers(c: Context) {
    const users = await this.userService.getUsers();
    return c.json(users);
  }

  async getUser(c: Context) {
    const id = c.req.param('id');
    const user = await this.userService.getUserById(id);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    return c.json(user);
  }
}
