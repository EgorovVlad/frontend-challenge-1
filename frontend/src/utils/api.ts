import axios from 'axios';
import authStore from '~/stores/auth.store';

export const serverApi = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL + '/api/v1',
  withCredentials: true
});

serverApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      authStore.setLoggedIn(false);
    }
    return Promise.reject(error);
  }
);