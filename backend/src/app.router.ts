import { Hono } from 'hono';
import { injectable, inject } from 'inversify';

import { Injection } from '@/injection/injection';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { AuthRouter } from '@/modules/auth/auth.router';
import { TicRouter } from '@/modules/tic/tic.router';

@injectable()
export class AppRouter {
  constructor(
    @inject(Injection.AuthRouter) private authRouter: AuthRouter,
    @inject(Injection.TicRouter) private ticRouter: TicRouter
  ) {}

  // Method to get the main application router
  public getRouter(): Hono {
    const router = new Hono();

    router.route('/auth', this.authRouter.getRouter());
    router.use('/tic/*', authMiddleware);
    router.route('/tic', this.ticRouter.getRouter());

    return router;
  }
}
