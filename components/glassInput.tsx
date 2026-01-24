// components/glassInput.tsx
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useRef } from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  TextInputProps,
} from "react-native";

interface GlassInputProps extends TextInputProps {
  icon: keyof typeof Ionicons.glyphMap;
}

export const GlassInput = ({ icon, ...props }: GlassInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const isPassword = props.secureTextEntry;

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View className="bg-white/10 border border-white/20 rounded-2xl h-14 flex-row items-center px-4 overflow-hidden">
      <Ionicons name={icon} size={20} color="#86efac" />
      <TextInput
        ref={inputRef}
        placeholderTextColor="#9ca3af"
        cursorColor="#22c55e"
        className="flex-1 ml-3 text-white text-base"
        {...props}
        secureTextEntry={isPassword ? !showPassword : false}
      />
      {isPassword && (
        <TouchableOpacity
          onPress={togglePassword}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          activeOpacity={0.7}
          // Previne que o toque tire o foco do input
          onPressIn={(e) => e.preventDefault()}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#9ca3af"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
