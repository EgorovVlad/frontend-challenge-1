import fs from 'node:fs/promises';
import path from 'node:path';
import * as process from 'node:process';

import { injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';

import { TiC, TiCFile } from '@/modules/tic/types';

@injectable()
export class TicStore {
  private readonly TIC_FOLDER_PATH = path.resolve(process.cwd(), 'store', 'tic');

  constructor() {
    // Create the TiC folder if it does not exist
    void fs.mkdir(this.TIC_FOLDER_PATH, { recursive: true });
  }

  public async getAllTics(): Promise<TiCFile[]> {
    const tics = await fs.readdir(this.TIC_FOLDER_PATH);
    const ticsPromises = tics.map((ticFile) => this.getTicFile(path.basename(ticFile, '.json')));
    return await Promise.all(ticsPromises).then((tics) => tics.filter((tic) => tic !== null) as TiCFile[]);
  }

  public async saveTicToFile(tic: TiC): Promise<TiCFile> {
    // Save TiC row to file
    const storeId = uuidv4();
    const storeTic: TiCFile = {
      id: storeId,
      url: `http://localhost:8080/store/tic/${storeId}.json`,
      data: tic,
    };
    const fileName = `${storeTic.id}.json`;
    await fs.writeFile(path.resolve(this.TIC_FOLDER_PATH, fileName), JSON.stringify(storeTic));
    return storeTic;
  }

  public async getTicFile(ticId: string): Promise<TiCFile | null> {
    if (!(await this.isTicFileExists(ticId))) return null;
    const data = await fs.readFile(path.resolve(this.TIC_FOLDER_PATH, `${ticId}.json`), 'utf-8');
    return JSON.parse(data) as TiCFile;
  }

  public async isTicFileExists(ticId: string): Promise<boolean> {
    try {
      await fs.access(path.resolve(this.TIC_FOLDER_PATH, `${ticId}.json`));
      return true;
    } catch {
      return false;
    }
  }
}
