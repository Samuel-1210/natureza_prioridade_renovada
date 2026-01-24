import { Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user, signOut } = useAuth();
  return (
    <View
      className="p-2 text-white"
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="p-2 text-black">
        Bem vindo!
        {user?.name}
      </Text>
      <Pressable onPress={() => signOut()}>
        <Text>LOGOUT</Text>
      </Pressable>
      <Link href="/about" className="p-2 text-black">
        <Text> Go to About screen</Text>
      </Link>
    </View>
  );
}
