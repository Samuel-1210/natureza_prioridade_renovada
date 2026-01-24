import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import {
  Button,
  TextField,
  Surface,
  Description,
  useToast,
} from "heroui-native";
import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  Dimensions,
  Touchable,
  TouchableOpacity,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useLogin } from "../../hooks/useLogin";
import { useRegister } from "../../hooks/useRegister";
import { Controller, useForm } from "react-hook-form";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export default function Register() {
  const router = useRouter();

  const { mutate, } = useRegister();

  const { control, handleSubmit } = useForm<RegisterForm>();

  const handleRegister = (data: RegisterForm) => {
    mutate({
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
  };

  const [viewPassword, setViewPassword] = useState(false);
  const [viewConfirmPassword, setViewConfirmPassword] = useState(false);

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

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
        >
          <Surface className="bg-white/95 rounded-t-[40px] rounded-b-none p-8 pb-12 shadow-2xl">
            <View className="items-center mb-6">
              <Text className="text-zinc-900 font-bold text-3xl text-center mb-2">
                Criar sua conta
              </Text>
              <Text className="text-zinc-500 text-center px-4 leading-5">
                Preencha os campos abaixo para criar sua conta.
              </Text>
            </View>

            <View className="gap-y-4 mb-8">
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <TextField>
                    <TextField.Label>Nome</TextField.Label>
                    <TextField.Input
                      placeholder="Seu nome"
                      onChangeText={onChange}
                      value={value}
                    />
                  </TextField>
                )}
              />

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
                    <View className="justify-center">
                      <TextField.Input
                        placeholder="••••••••"
                        secureTextEntry={!viewPassword}
                        className="pr-12"
                        onChangeText={onChange}
                        value={value}
                      />
                      <TouchableOpacity
                        onPress={() => setViewPassword(!viewPassword)}
                        className="absolute right-4"
                      >
                        <Ionicons
                          name={
                            viewPassword ? "eye-outline" : "eye-off-outline"
                          }
                          size={24}
                          color="#71717a"
                        />
                      </TouchableOpacity>
                    </View>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="password_confirmation"
                render={({ field: { onChange, value } }) => (
                  <TextField>
                    <TextField.Label>Confirmar Senha</TextField.Label>
                    <View className="justify-center">
                      <TextField.Input
                        placeholder="••••••••"
                        secureTextEntry={!viewConfirmPassword}
                        className="pr-12"
                        onChangeText={onChange}
                        value={value}
                      />
                      <TouchableOpacity
                        onPress={() =>
                          setViewConfirmPassword(!viewConfirmPassword)
                        }
                        className="absolute right-4"
                      >
                        <Ionicons
                          name={
                            viewConfirmPassword
                              ? "eye-outline"
                              : "eye-off-outline"
                          }
                          size={24}
                          color="#71717a"
                        />
                      </TouchableOpacity>
                    </View>
                  </TextField>
                )}
              />
            </View>

            <Button
              className="w-full h-14 rounded-2xl bg-green-600 active:bg-green-700 shadow-lg shadow-green-900/30"
              onPress={handleSubmit(handleRegister)}
            >
              <Button.Label className="text-white font-bold text-lg">
                Cadastrar
              </Button.Label>
            </Button>
            <Description className="text-center mx-2 mt-2">
              Ao se cadastrar você concorda com os termos de uso e política de
              privacidade.
            </Description>

            <View className="mt-8 flex-row items-center justify-center">
              <Text className="text-zinc-500 text-base">Já tem uma conta?</Text>

              <TouchableOpacity
                onPress={() => router.replace("/(auth)/login")}
                className="ml-1"
              >
                <Text className="text-green-600 font-bold text-base">
                  Faça login
                </Text>
              </TouchableOpacity>
            </View>
          </Surface>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
