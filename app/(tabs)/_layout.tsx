import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";

export default function TabLayout() {
  if (Platform.OS === "ios") {
    return (
      <NativeTabs backgroundColor="#3EA201" disableIndicator={true}>
        <NativeTabs.Trigger name="home">
          <Label>Home</Label>
          <Icon
            sf="house.fill"
            androidSrc={<VectorIcon family={Ionicons} name="home" />}
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="about">
          <Label>About</Label>
          <Icon
            sf="info.circle"
            androidSrc={
              <VectorIcon family={Ionicons} name="information-circle" />
            }
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="profile">
          <Label>Perfil</Label>
          <Icon
            sf="person.circle"
            androidSrc={<VectorIcon family={Ionicons} name="person" />}
          />
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#295700",
        tabBarInactiveTintColor: "#3ea201",
        tabBarActiveBackgroundColor: "#C0E3AF",
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          borderRadius: 25,
          height: 65,
          backgroundColor: "white",
          borderTopWidth: 0,
          elevation: 8,
          marginHorizontal: 20,
          shadowColor: "transparent",
        },
        tabBarItemStyle: {
          borderRadius: 30,
          marginHorizontal: 8,
          marginVertical: 8,
          height: 49,
          paddingVertical: 4,
          overflow: "hidden",
        },
        tabBarIconStyle: {
          marginTop: -4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: -6,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={22}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused ? "information-circle" : "information-circle-outline"
              }
              color={color}
              size={22}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              color={color}
              size={22}
            />
          ),
        }}
      />
    </Tabs>
  );
}
