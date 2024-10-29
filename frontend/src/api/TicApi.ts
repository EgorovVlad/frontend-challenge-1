import { serverApi } from "~/utils/api";
import { TiCFile } from "~/types/tic/types";

export class TicApi {
  static async getTics() {
    const response = await serverApi.get("/tic");
    return response.data as TiCFile[];
  }

  static async getTic(ticId: string) {
    const response = await serverApi.get(`/tic/${ticId}`);
    return response.data as TiCFile;
  }

  static async uploadCsvTicFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await serverApi.post("/tic/upload/csv", formData);
    return response.data as TiCFile[];
  }
}
