import { instance } from "../api/api";

export const postLogin = (email: string, password: string) => {
  return instance
    .post("/auth/login", { email, password })
    .then((res) => res.data);
};

export type registerResponse = {
  message: string;
};

export const postRegister = (
  name: string,
  email: string,
  password: string,
  password_confirmation: string,
) => {
  return instance
    .post<registerResponse>("/auth/register", {
      name,
      email,
      password,
      password_confirmation,
    })
    .then((res) => res.data);
};
