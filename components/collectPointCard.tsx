import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";

interface CollectPointCardProps {
  name: string;
  zipCode: string;
  description?: string;
  principalImage: string;
  category?: string;
}

export function CollectPointCard({
  name,
  zipCode,
  description,
  principalImage,
  category,
}: CollectPointCardProps) {
  return (
    <View className="mb-2 bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
      <View className="relative">
        <Image
          source={{ uri: principalImage }}
          className="w-full h-40"
          contentFit="cover"
          transition={500}
          style={{ width: "100%", height: 128, borderRadius: 8 }}
        />
        {category && (
          <View className="absolute top-3 right-2 bg-white px-3 py-1 rounded-full shadow-sm">
            <Text className="text-green-700 font-bold text-[10px] uppercase font-riot">
              {category}
            </Text>
          </View>
        )}
      </View>
      <View className="p-4">
        <Text
          className="text-lg font-bold font-riot text-gray-900 mb-1"
          numberOfLines={1}
        >
          {name}
        </Text>

        <View className="flex-row items-center gap-1 mb-2">
          <Ionicons name="location-outline" size={14} color="green" />
          <Text className="text-xs text-gray-400 font-sans">{zipCode}</Text>
        </View>

        {description && (
          <Text
            className="text-sm text-gray-500 font-sans leading-relaxed"
            numberOfLines={2}
          >
            {description}
          </Text>
        )}
      </View>
    </View>
  );
}
