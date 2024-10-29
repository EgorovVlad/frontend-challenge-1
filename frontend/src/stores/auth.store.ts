import { makeAutoObservable } from 'mobx';

class AuthStore {
  private isLoggedIn: boolean = localStorage.getItem('isLoggedIn') === '1';

  constructor() {
    makeAutoObservable(this);
  }

  setLoggedIn = (status: boolean) => {
    this.isLoggedIn = status;
    if (status) localStorage.setItem('isLoggedIn', '1');
    else localStorage.removeItem('isLoggedIn');
  }

  get isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}

const authStore = new AuthStore();
export const useAuthStore = () => authStore;
export default authStore;

