import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Button, Spinner } from "heroui-native";
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
import { GlassInput } from "../../components/glassInput";
import { useLogin } from "../../hooks/useLogin";

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

  const { control, handleSubmit } = useForm<LoginForm>();

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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
          className="px-6 pb-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mb-10">
            <View className="flex-row items-center mr-8">
              <Text className="text-white text-5xl font-riot text-center mb-3 tracking-wide">
                Natureza Prioridade
              </Text>
              <Image
                source={require("../../assets/logotipo.png")}
                className="-ml-16 h-30 w-30 rounded-full object-cover"
              />
            </View>

            <Text className="text-gray-200 text-lg text-center px-4 font-sans leading-6 opacity-90">
              Conectando você ao que realmente importa.
            </Text>
          </View>

          <View className="gap-y-5 mb-8">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <GlassInput
                  icon="mail-outline"
                  placeholder="Seu email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <GlassInput
                  icon="lock-closed-outline"
                  placeholder="Sua senha"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>

          <Button
            className="w-full h-14 rounded-2xl bg-green-600 active:bg-green-700 shadow-lg shadow-green-900/50 mb-3 border-0"
            onPress={handleSubmit(handleLogin)}
          >
            <Button.Label className="text-white text-lg font-bold tracking-wider">
              {isPending ? <Spinner color="white" /> : "ENTRAR"}
            </Button.Label>
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="pb-8 flex-row items-center justify-center">
        <Text className="text-gray-400 text-base font-sans">
          Ainda não tem conta?
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          className="ml-2"
        >
          <Text className="text-green-400 font-bold text-base font-sans">
            Criar conta
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
