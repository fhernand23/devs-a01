export interface JWTPayload {
  role: Array<RoleAuthority>;
  sub: string;
  country: string;
  occupation: string;
  surname: string;
  university: string;
  name: string;
  email: string;
}

export interface RoleAuthority {
  authority: string;
};

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}