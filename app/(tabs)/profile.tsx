import { LinearGradient } from "expo-linear-gradient";
import { Card } from "heroui-native";
import { Dimensions, Image, ScrollView, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("window");

export default function Profile() {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 100,
      }}
      className="bg-green-50"
    >
      <View className="relative w-full h-48 mb-16">
        <Image
          source={require("../../assets/6221798.jpg")}
          className="w-full h-full object-cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          className="absolute inset-0"
        />

        <View
          className="absolute -bottom-12 self-center items-center justify-center"
          style={{ left: width / 2 - 56 }}
        >
          <View className=" bg-white rounded-full ">
            <Image
              source={require("../../assets/6221798.jpg")}
              className="w-30 h-30 rounded-full border-2 border-white/20 object-cover"
            />
          </View>
        </View>
      </View>

      <View className="items-center mb-6">
        <Text className="text-black text-2xl font-riot mt-2">{user?.name}</Text>
        <Text className="text-gray-600 text-sm font-sans">{user?.email}</Text>
      </View>

      <View className="flex-1 ">
        <Card className="rounded-none border-0 bg-white shadow-sm">
          <Card.Header className="">
            <Text className="text-xl font-riot text-green-800">
              Informações
            </Text>
          </Card.Header>
          <Card.Body className="mt-2 -ml-2 gap-y-3">
            <View className="flex-row items-center gap-x-4">
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                <Ionicons name="globe-outline" size={20} color="#166534" />
              </View>
              <View className="flex-1 flex-row justify-between items-center">
                <Text className="text-gray-400 text-xs font-sans uppercase tracking-wider">
                  Website
                </Text>
                <Text className="text-black font-sans font-medium text-right">
                  naturezaprioridade.com.br
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-x-4">
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                <Ionicons name="call-outline" size={20} color="#166534" />
              </View>
              <View className="flex-1 flex-row justify-between items-center">
                <Text className="text-gray-400 text-xs font-sans uppercase tracking-wider">
                  Telefone
                </Text>
                <Text className="text-black font-sans font-medium">
                  (11) 98765-4321
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-x-4">
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                <Ionicons name="calendar-outline" size={20} color="#166534" />
              </View>
              <View className="flex-1 flex-row justify-between items-center">
                <Text className="text-gray-400 text-xs font-sans uppercase tracking-wider">
                  Desde
                </Text>
                <Text className="text-black font-sans font-medium">
                  Jan 2026
                </Text>
              </View>
            </View>
          </Card.Body>
        </Card>
      </View>

      <View className="mx-4 items-start ">
        <Text className="text-gray-500 text-xs font-riot">
          Informações do aplicativo:
        </Text>
        <Text className="text-gray-500 text-xs font-riot">
          Natureza Prioridade • 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}
