import { Hono } from 'hono';
import { inject, injectable } from 'inversify';

import { Injection } from '@/injection/injection';
import { AuthController } from '@/modules/auth/auth.controller';

@injectable()
export class AuthRouter {
  constructor(@inject(Injection.AuthController) private authController: AuthController) {}

  public getRouter(): Hono {
    const router = new Hono();

    router.post('/login', this.authController.login);
    router.post('/logout', this.authController.logout);

    return router;
  }
}
