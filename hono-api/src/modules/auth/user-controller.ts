import type { AppContext } from '@app/common/interfaces';

import type { AuthContainer, UserController } from './interfaces';

export class UserControllerImpl implements UserController {
  private userService: AuthContainer['userService'];

  constructor({ userService }: AuthContainer) {
    this.userService = userService;
  }

  async findUsers(c: AppContext) {
    const name = c.req.query('name');
    const users = await this.userService.findUsers(name);
    return c.json(users);
  }

  async getUser(c: AppContext) {
    const id = c.req.param('id');
    const user = await this.userService.getUserById(id);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    return c.json(user);
  }

  async createUser(c: AppContext) {
    const data = await c.req.json();
    const user = await this.userService.createUser(data);
    return c.json(user, 201);
  }

  async updateUser(c: AppContext) {
    const id = c.req.param('id');
    const data = await c.req.json();
    const user = await this.userService.updateUser(id, data);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    return c.json(user);
  }

  async deleteUser(c: AppContext) {
    const id = c.req.param('id');
    const success = await this.userService.deleteUser(id);
    if (!success) {
      return c.json({ error: 'User not found' }, 404);
    }
    return c.json({ success: true });
  }
}
