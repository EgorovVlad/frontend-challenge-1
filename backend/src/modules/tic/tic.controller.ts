import { StatusCodes } from 'http-status-codes';
import { injectable, inject } from 'inversify';

import { AppError } from '@/errors/app.error';
import { Injection } from '@/injection/injection';
import { TicService } from '@/modules/tic/tic.service';
import { TicStore } from '@/modules/tic/tic.store';
import { autoBindClassMethods } from '@/utils/auto-bind-class-methods';

import type { Context } from 'hono';

@injectable()
export class TicController {
  constructor(
    @inject(Injection.TicService) private ticService: TicService,
    @inject(Injection.TicStore) private ticStore: TicStore
  ) {
    autoBindClassMethods(this);
  }

  public async getTics(c: Context) {
    const tics = await this.ticStore.getAllTics();
    return c.json(tics);
  }

  public async getTic(c: Context) {
    const { ticId } = c.req.param();
    const tic = await this.ticStore.getTicFile(ticId);
    if (!tic) throw new AppError('TiC not found', StatusCodes.NOT_FOUND);
    return c.json(tic);
  }

  public async uploadCSV(c: Context) {
    try {
      const body = await c.req.parseBody(); // Parse CSV data from request body
      const csvFile = body['file'] as File;
      const ticRows = await this.ticService.generateFromCSVFile(csvFile); // Convert CSV data to TiC format
      return c.json(ticRows); // Return converted data
    } catch {
      throw new AppError('Failed to process CSV', StatusCodes.BAD_REQUEST); // Handle CSV processing errors
    }
  }
}
