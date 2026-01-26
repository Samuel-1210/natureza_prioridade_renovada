import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Button, Description } from "heroui-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import { GlassInput } from "../../components/glassInput";
import { useRegister } from "../../hooks/useRegister";

const registerSchema = z
  .object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Senhas não conferem",
    path: ["password_confirmation"],
  });

type RegisterForm = z.infer<typeof registerSchema>;
const { height } = Dimensions.get("window");

export default function Register() {
  const router = useRouter();

  const { mutate } = useRegister();

  const { control, handleSubmit } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const handleRegister = (data: RegisterForm) => {
    mutate({
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
  };

  return (
    <View className="flex-1 bg-black">
      <View className="absolute inset-0 w-full h-full">
        <Image
          source={require("../../assets/6221798.jpg")}
          className="w-full h-full object-cover opacity-80"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.95)"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: height * 0.8,
          }}
        />
      </View>

      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <View className="items-center mb-6 justify-end mt-12 px-6">
          <Text className="text-white text-5xl text-center mb-2 font-riot">
            Criar sua conta
          </Text>
          <Text className="text-gray-200 text-center px-4 leading-5 font-sans opacity-90">
            Preencha os campos abaixo para criar sua conta.
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
          className="px-6 pb-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-y-4 mb-8">
            <Controller
              control={control}
              name="name"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <View>
                  <GlassInput
                    icon="person-outline"
                    placeholder="Seu nome"
                    onChangeText={onChange}
                    value={value}
                  />
                  {error && (
                    <Text className="text-red-500 text-sm ml-2 mt-1">
                      {error.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <View>
                  <GlassInput
                    icon="mail-outline"
                    placeholder="seu@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={onChange}
                    value={value}
                  />
                  {error && (
                    <Text className="text-red-500 text-sm ml-2 mt-1">
                      {error.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <View>
                  <GlassInput
                    icon="lock-closed-outline"
                    placeholder="Senha"
                    secureTextEntry={true}
                    onChangeText={onChange}
                    value={value}
                  />
                  {error && (
                    <Text className="text-red-500 text-sm ml-2 mt-1">
                      {error.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="password_confirmation"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <View>
                  <GlassInput
                    icon="lock-closed-outline"
                    placeholder="Confirme sua senha"
                    secureTextEntry={true}
                    onChangeText={onChange}
                    value={value}
                  />
                  {error && (
                    <Text className="text-red-500 text-sm ml-2 mt-1">
                      {error.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          <Button
            className="w-full h-14 rounded-2xl bg-green-600 active:bg-green-700 shadow-lg shadow-green-900/50 mb-3 border-0"
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
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="pb-8 flex-row items-center justify-center">
        <Text className="text-gray-400 text-base font-sans">
          Já tem uma conta?
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          className="ml-2"
        >
          <Text className="text-green-400 font-bold text-base font-sans">
            Faça login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
