import type { UserController } from './user-controller';
import type { UserService } from './user-service';

export interface AuthContainer {
  userService: UserService;
  userController: UserController;
}
