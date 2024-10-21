import { Link } from "expo-router";
import { Text, SafeAreaView, Pressable } from "react-native"
export default function Index() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Profile page</Text>
      {/* <Link href="../sign_up" asChild> */}
      {/* <Link href="../login" asChild> */}
      <Link href="../start" asChild>
        <Pressable>
          <Text>Open start page</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}
