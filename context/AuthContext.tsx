import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

interface User {
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  signOut: () => void;
  saveUser: (user: User, token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storagedUser = await AsyncStorage.getItem("@user");
      const storagedToken = await AsyncStorage.getItem("@token");

      if (storagedUser && storagedToken) {
        setUser(JSON.parse(storagedUser));
      }
      setIsLoading(false);
    }

    loadStorageData();
  }, []);

  async function saveUser(user: User, token: string) {
    setUser(user);
    await AsyncStorage.setItem("@user", JSON.stringify(user));
    await AsyncStorage.setItem("@token", token);
  }

  function signOut() {
    AsyncStorage.clear().then(() => {
      setUser(null);
      router.replace("/(auth)/login");
    });
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, saveUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}
