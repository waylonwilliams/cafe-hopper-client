import { router } from "expo-router";
import { Pressable, SafeAreaView, Text } from "react-native";

export default function CafeLayout() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable onPress={() => router.back()}>
        <Text>Return</Text>
      </Pressable>
      <Text>Meow.</Text>
    </SafeAreaView>
  );
}
