import { router } from "expo-router";
import { Image, Pressable, SafeAreaView, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef } from "react";
/**
 * When you click on a cafe card / pin on map this page will be shown
 * Ideally upgrade this to take in a cafe as a param and render it that way
 */
export default function CafeLayout() {
  // idk stuff for the bottom sheet
  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  const snapPoints = useMemo(() => ["75%", "95%"], []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        backgroundColor: "#white",
      }}
    >
      <View
        style={{ backgroundColor: "#f0f0f0", height: "100%", width: "100%" }}
      >
        <Image
          style={{ top: -70, width: "100%", position: "absolute" }}
          source={require("../../assets/images/oshimacafe.png")}
        />

        <Pressable onPress={() => router.back()}>
          <Ionicons
            name="chevron-back"
            size={24}
            color="white"
            style={{ padding: 4, position: "absolute", zIndex: 2 }}
          />
        </Pressable>

        <BottomSheet
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          index={0}
          snapPoints={snapPoints}
        >
          <BottomSheetView
            style={{
              padding: 24,
            }}
          >
            <Text>Here i am</Text>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </SafeAreaView>
  );
}
