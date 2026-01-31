import { Stack } from "expo-router";

export default function CollectLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="new" />
    </Stack>
  );
}
