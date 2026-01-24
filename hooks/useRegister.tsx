import { useMutation } from "@tanstack/react-query";
import { postRegister } from "../api/user";
import { useToast } from "heroui-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export const useRegister = () => {
  const router = useRouter();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({
      name,
      email,
      password,
      password_confirmation,
    }: {
      name: string;
      email: string;
      password: string;
      password_confirmation: string;
    }) => postRegister(name, email, password, password_confirmation),

    onSuccess: (data) => {
      toast.show({
        variant: "success",
        label: data.message,
        icon: <Ionicons name="checkmark-circle" size={24} color="green" />,
        actionLabel: "Fechar",
        onActionPress: ({ hide }) => hide(),
      });
      router.push("/(auth)/login");
    },
    onError: (error) => {
      console.log("Erro no cadastro", error);
    },
  });
};
