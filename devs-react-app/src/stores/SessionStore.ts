import { makeAutoObservable, runInAction } from "mobx";
import { decodeJwt, isTokenExpired } from "../utils/jwt";
import { JWTPayload, LoginResponse, RoleAuthority } from "../entities/jwt";
import { BASE_PATH, ROUTES, TOAST_PROPS } from "../utils/constants";
import { toast } from "react-toastify";
import { User } from "../entities/user";

class SessionStore {
  timer: number = 5000;
  username: string = "";
  password: string = "";
  role: RoleAuthority[] = [];
  userSession: Partial<User> | null = null;

  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  isLoading: boolean = false;
  loginError: boolean = false;
  loginErrorCode: number = -1;
  loginAttempts: number = 0;

  checkLoginStatus() {
    const jwt = localStorage.getItem("jwt");
    if (jwt !== null && !isTokenExpired(jwt)) {
      this.setIsLoggedIn(true);
      const roles: any = localStorage.getItem("roles");
      if (roles === "ADMIN") this.setIsAdmin(true);
    } else {
      this.setIsLoggedIn(false);
      this.setIsAdmin(false);
    }
  }

  constructor() {
    makeAutoObservable(this);
    const username = localStorage.getItem("username");
    const roles: any = localStorage.getItem("roles");
    const email = localStorage.getItem("email");
    const university = localStorage.getItem("university");
    const occupation = localStorage.getItem("occupation");
    const country = localStorage.getItem("country");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    const jwt = localStorage.getItem("jwt");
    if (
      username !== null &&
      roles !== null &&
      email !== null &&
      occupation !== null &&
      firstName !== null &&
      lastName !== null &&
      country !== null &&
      university !== null &&
      jwt !== "" &&
      jwt !== null &&
      !isTokenExpired(jwt)
    ) {
      this.username = username;
      this.role = roles;
      this.userSession = {
        email,
        university,
        occupation,
        country,
        firstName,
        lastName,
      };
      this.setIsLoggedIn(true);
      if (roles === "ADMIN") this.setIsAdmin(true);
    }
  }

  setAuthenticationInfo(
    info: LoginResponse,
    username: string,
    password: string
  ) {
    if (info.refresh_token !== "") {
      this.setUserInfo(info.refresh_token);
      if (this.username !== "" && this.role !== null) {
        localStorage.removeItem("password");
        this.login();
      }
    } else {
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
    }
    this.setLoginError(false);
  }

  setUserInfo(jwt: string) {
    const decodedPayload: JWTPayload = decodeJwt(jwt);
    localStorage.setItem("jwt", jwt);
    localStorage.setItem("username", decodedPayload.sub);
    localStorage.setItem("roles", decodedPayload.role[0].authority);
    localStorage.setItem("email", decodedPayload.email);
    localStorage.setItem("university", decodedPayload.university);
    localStorage.setItem("occupation", decodedPayload.occupation);
    localStorage.setItem("country", decodedPayload.country);
    localStorage.setItem("firstName", decodedPayload.name);
    localStorage.setItem("lastName", decodedPayload.surname);
    this.userSession = {
      email: decodedPayload.email,
      university: decodedPayload.university,
      occupation: decodedPayload.occupation,
      country: decodedPayload.country,
      firstName: decodedPayload.name,
      lastName: decodedPayload.surname,
    };
    this.username = decodedPayload.sub;
    this.role = decodedPayload.role;
    return decodedPayload;
  }

  async login() {
    this.setIsLoggedIn(true);
    this.setLoginAttempts(0);
    toast.success("Welcome back! You are now logged in.", TOAST_PROPS);
    window.location.href = `${BASE_PATH}${ROUTES.LOGIN}`;
  }

  setUsername(username: string) {
    this.username = username;
    localStorage.setItem("username", username);
  }

  setError(errorCode: number) {
    this.setLoginError(true);
    this.loginErrorCode = errorCode;
    if (errorCode !== 200) {
      this.increaseLoginAttempts();
    }
  }

  increaseLoginAttempts() {
    this.loginAttempts = this.loginAttempts + 1;
  }

  setLoginAttempts(attempts: number) {
    this.loginAttempts = attempts;
  }

  getJwt() {
    return localStorage.getItem("jwt");
  }

  async logout() {
    this.setIsLoading(true);
    await this.wipeUserData();
  }

  async wipeUserData() {
    this.username = "";
    this.role = [];
    this.setIsLoggedIn(false);
    localStorage.clear();
    this.setIsLoading(false);
  }

  setIsLoggedIn(value: boolean) {
    runInAction(() => {
      this.isLoggedIn = value;
    });
  }

  setIsAdmin(value: boolean) {
    runInAction(() => {
      this.isAdmin = value;
    });
  }

  setIsLoading(value: boolean) {
    runInAction(() => {
      this.isLoading = value;
    });
  }

  setLoginError(value: boolean) {
    runInAction(() => {
      this.loginError = value;
    });
  }
}

export default new SessionStore();
