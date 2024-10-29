import { serverApi } from "~/utils/api";

export class AuthApi {
  static async login(username: string, password: string) {
    await serverApi.post("/auth/login", { username, password });
  }

  static async logout() {
    await serverApi.post("/auth/logout");
  }
}
