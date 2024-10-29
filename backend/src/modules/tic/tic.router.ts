import { Hono } from 'hono';
import { inject, injectable } from 'inversify';

import { Injection } from '@/injection/injection';
import { TicController } from '@/modules/tic/tic.controller';

@injectable()
export class TicRouter {
  constructor(@inject(Injection.TicController) private ticController: TicController) {}

  public getRouter(): Hono {
    const router = new Hono();

    router.get('/', this.ticController.getTics);
    router.get('/:ticId', this.ticController.getTic);
    router.post('/upload/csv', this.ticController.uploadCSV);

    return router;
  }
}
