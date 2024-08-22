import { StatusCodes } from "http-status-codes";
import { makeAutoObservable, runInAction } from "mobx";
import SessionStore from "./SessionStore";
import { toast } from "react-toastify";
import { BASE_PATH, ROUTES, TOAST_PROPS } from "../utils/constants";
import { User } from "../entities/user";
import { API, GETHeader, POSTFormHeader } from "../utils/api";

class UserStore {
  isLoading: boolean = false;
  users: User[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async registerUser(
    email: string,
    username: string,
    password: string,
    university: string,
    occupation?: string,
    country?: string,
    firstName?: string,
    lastName?: string
  ) {
    this.setIsLoading(true);
    try {
      const r = await API.post(`/auth/register`, {
        email,
        username,
        password,
        university,
        occupation,
        country,
        firstName,
        lastName,
      });
      if (r.status === StatusCodes.OK) {
        SessionStore.setUsername(username);
        toast.success(
          "Registration complete. You can now log in with your credentials.",
          TOAST_PROPS
        );
        setTimeout(function () {
          window.location.href = `${BASE_PATH}${ROUTES.LOGIN}`;
        }, 2000);
      }
    } catch (e: any) {
      if (e.response && e.response.status === 400) {
        toast.error(e.response.data, TOAST_PROPS);
      } else {
        console.error("An error occurred:", e);
      }
    }
    this.setIsLoading(false);
  }

  async getUsers() {
    this.setIsLoading(true);
    try {
      const response = await API.get("/users", { headers: GETHeader });
      this.setUsers(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error("Error getting users", TOAST_PROPS);
    } finally {
      this.setIsLoading(false);
    }
  }

  setUsers(users: User[]) {
    runInAction(() => {
      this.users = users;
    });
  }

  setIsLoading(value: boolean) {
    runInAction(() => {
      this.isLoading = value;
    });
  }

  async uploadUser(formData: FormData) {
    this.setIsLoading(true);

    try {
      const r = await API.post("/users/upload", formData, {
        headers: POSTFormHeader,
      });
      if (r.status === StatusCodes.OK) {
        toast.success("User uploaded successfully", { hideProgressBar: true });
        await this.getUsers();
      }
    } catch (error) {
      toast.error("Something went wrong", { hideProgressBar: true });
    } finally {
      this.setIsLoading(false);
    }
  }

  async updateUser(formData: FormData, userId: number) {
    this.setIsLoading(true);
    try {
      const r = await API.put(`/users/${userId}`, formData, {
        headers: POSTFormHeader,
      });
      if (r.status === StatusCodes.OK) {
        toast.success("User updated successfully", { hideProgressBar: true });
        await this.getUsers();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", { hideProgressBar: true });
    } finally {
      this.setIsLoading(false);
    }
  }

  async deleteUser(userId: number) {
    this.setIsLoading(true);
    try {
      const r = await API.delete(`/users/${userId}`, {
        headers: GETHeader,
      });
      if (r.status === StatusCodes.OK) {
        toast.success("User deleted successfully", { hideProgressBar: true });
        await this.getUsers();
      }
    } catch (error) {
      toast.error("Something went wrong", { hideProgressBar: true });
    } finally {
      this.setIsLoading(false);
    }
  }
}

export default new UserStore();
