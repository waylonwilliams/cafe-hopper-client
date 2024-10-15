import { Link } from "expo-router";
import { Text, SafeAreaView, Pressable } from "react-native";

export default function Index() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/cafe" asChild>
        <Pressable>
          <Text>Open cafe view</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}
