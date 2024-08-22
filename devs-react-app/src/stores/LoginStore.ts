import { makeAutoObservable } from 'mobx';
import { StatusCodes } from 'http-status-codes';
import SessionStore from './SessionStore';
import { toast } from 'react-toastify';
import { TOAST_PROPS } from '../utils/constants';
import { API } from '../utils/api';

class LoginStore {
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  async login(username: string, password: string) {
    this.isLoading = true;
    try {
      const r = await API.post('/auth/authenticate', { username, password });
      if (r.status === StatusCodes.OK) {
        SessionStore.setAuthenticationInfo(r.data, username, password);
      } else {
        SessionStore.setError(r.status);
        toast.error('Oops! Invalid username or password. Please try again.', TOAST_PROPS);
      }
    } catch (e: any) {
      SessionStore.setError(e.response?.status);
      toast.error('Oops! Invalid username or password. Please try again.', TOAST_PROPS);
    } finally {
      this.isLoading = false;
    }
  }
}

export default new LoginStore();