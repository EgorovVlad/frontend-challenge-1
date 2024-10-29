import { makeAutoObservable } from 'mobx';
import { TicApi } from "~/api/TicApi";
import { TiCFile } from "~/types/tic/types";

class TicStore {
  private _ticsFiles: TiCFile[] = [];
  private _isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadTicFiles = async () => {
    this.setIsLoading(true);
    try {
      const files = await TicApi.getTics();
      this.setTicFiles(files);
    } catch {
    } finally {
      this.setIsLoading(false);
    }
  };

  uploadCsvTicFile = async (file: File) => {
    this.setIsLoading(true);
    try {
      const newTicFiles = await TicApi.uploadCsvTicFile(file);
      this.setTicFiles([...this.ticsFiles, ...newTicFiles]);
    } catch {
    } finally {
      this.setIsLoading(false);
    }
  };

  get ticsFiles() {
    return this._ticsFiles;
  }

  get isLoading() {
    return this._isLoading;
  }

  private setIsLoading = (isLoading: boolean) => {
    this._isLoading = isLoading;
  };

  private setTicFiles = (files: TiCFile[]) => {
    this._ticsFiles = files;
  };
}

const ticStore = new TicStore();
export const useTicStore = () => ticStore;
export default ticStore;
