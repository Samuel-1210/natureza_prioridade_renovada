import { instance } from "../api/api";

export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

export type LoginResponse = {
  user: User;
  access_token: string;
};

export const postLogin = (email: string, password: string) => {
  return instance
    .post<LoginResponse>("/auth/login", { email, password })
    .then((res) => res.data);
};

export type RegisterResponse = {
  message: string;
};

export const postRegister = (
  name: string,
  email: string,
  password: string,
  password_confirmation: string,
) => {
  return instance
    .post<RegisterResponse>("/auth/register", {
      name,
      email,
      password,
      password_confirmation,
    })
    .then((res) => res.data);
};
