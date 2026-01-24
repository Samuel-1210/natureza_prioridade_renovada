import { useRouter } from "expo-router";
import { Button, TextField, Surface, Spinner } from "heroui-native";
import React, { useEffect } from "react";
import {
  Text,
  View,
  Image,
  Dimensions,
  Touchable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useLogin } from "../../hooks/useLogin";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";

const { height } = Dimensions.get("window");

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const router = useRouter();

  const { mutate, isPending } = useLogin();

  const handleLogin = (data: LoginForm) => {
    mutate({ email: data.email, password: data.password });
  };

  const { control, handleSubmit, watch } = useForm<LoginForm>();

  useEffect(() => {
    console.log(watch("email"));
    console.log(watch("password"));
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      style={{ flex: 1 }}
    >
      <View className="flex-1 bg-black">
        <View className="absolute top-0 w-full h-full">
          <Image
            source={require("../../assets/6221798.jpg")}
            className="w-full h-full object-cover"
          />
          <View className="absolute inset-0 bg-black/40" />
        </View>

        <View className="flex-1 justify-end">
          <Surface className="bg-white/95 rounded-t-[40px] rounded-b-none p-8 pb-12">
            <View className="items-center mb-6">
              <Text className="text-zinc-900 font-bold text-3xl text-center mb-2">
                Natureza Prioridade
              </Text>
              <Text className="text-zinc-500 text-center px-4 leading-5">
                Conectando você ao que realmente importa. Sua jornada
                sustentável começa aqui.
              </Text>
            </View>

            <View className="gap-y-4 mb-8">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextField>
                    <TextField.Label>Email</TextField.Label>
                    <TextField.Input
                      placeholder="seu@email.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onChangeText={onChange}
                      value={value}
                    />
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextField>
                    <TextField.Label>Senha</TextField.Label>
                    <TextField.Input
                      placeholder="••••••••"
                      onChangeText={onChange}
                      value={value}
                    />
                  </TextField>
                )}
              />
            </View>

            <Button
              className="w-full h-14 rounded-2xl bg-green-600 active:bg-green-700 shadow-lg shadow-green-900/30"
              onPress={handleSubmit(handleLogin)}
            >
              <Button.Label className="text-white font-bold text-lg">
                {isPending ? <Spinner color="white" /> : "Entrar Agora"}
              </Button.Label>
            </Button>

            <View className="mt-8 flex-row items-center justify-center">
              <Text className="text-zinc-500 text-base">
                Não tem uma conta?
              </Text>

              <TouchableOpacity
                onPress={() => router.push("/(auth)/register")}
                className="ml-1"
              >
                <Text className="text-green-600 font-bold text-base">
                  Cadastre-se
                </Text>
              </TouchableOpacity>
            </View>
          </Surface>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
