import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from "expo-router/unstable-native-tabs";
import { Platform, View } from "react-native";

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
        tabBarActiveTintColor: "#3ea201",
        //  tabBarActiveTintColor: "#295700",
        tabBarInactiveTintColor: "#3ea201",
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
          marginVertical: 0,
          shadowColor: "transparent",
        },
        tabBarItemStyle: {
          borderRadius: 100,
          marginHorizontal: 8,
          height: 65,
          paddingVertical: 4,
          overflow: "hidden",
        },

        tabBarLabelStyle: {
          marginTop: 6,
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#C0E3AF" : "transparent",
                borderRadius: 30,
                padding: 10,
                height: 44,
                width: 44,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name={focused ? "home-sharp" : "home-outline"}
                color={color}
                size={22}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#C0E3AF" : "transparent",
                borderRadius: 30,
                padding: 10,
                height: 44,
                width: 44,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name={
                  focused ? "information-circle" : "information-circle-outline"
                }
                color={color}
                size={22}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#C0E3AF" : "transparent",
                borderRadius: 30,
                padding: 10,
                height: 44,
                width: 44,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name={focused ? "person-circle" : "person-circle-outline"}
                color={color}
                size={22}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
