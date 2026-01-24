import { useMutation } from "@tanstack/react-query";
import { postLogin } from "../api/user";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";

export const useLogin = () => {
  const { saveUser } = useAuth();
  const router = useRouter();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      postLogin(email, password),
    onSuccess: (data) => {
      saveUser(data.user, data.access_token);
      router.push("/(tabs)/home");
    },
    onError: (error) => {
      console.log("Erro no login", error);
    },
  });
};
