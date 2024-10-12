import { router } from "expo-router";
import { Image, Pressable, SafeAreaView, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef, useState } from "react";
/**
 * When you click on a cafe card / pin on map this page will be shown
 * Ideally upgrade this to take in a cafe as a param and render it that way
 */
export default function CafeLayout() {
  // idk stuff for the bottom sheet
  const bottomSheetRef = useRef<BottomSheet>(null);
  //   const handleSheetChanges = useCallback((index: number) => {}, []);
  const snapPoints = useMemo(() => ["75%", "95%"], []); // 95% so you can see back button

  const [liked, setLiked] = useState(false);
  const [togo, setTogo] = useState(false);

  const cafe = {
    name: "Cafe Oshima's",
    address: "2/37 Cao Thang, Ward 5, District 3, Ho Chi Minh City, Vietnam",
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        backgroundColor: "white",
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
          //   onChange={handleSheetChanges}
          index={0}
          snapPoints={snapPoints}
        >
          <BottomSheetView
            style={{
              padding: 20,
              paddingHorizontal: 25,
              flex: 1,
              flexDirection: "column",
              gap: 10,
            }}
          >
            {/* Name of cafe header */}
            <Text style={{ fontSize: 36, fontWeight: 500 }}>{cafe.name}</Text>

            {/* First bar, reviews, quick */}
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <View>
                <View
                  style={{
                    borderColor: "#000000",
                    borderRadius: 20,
                    borderWidth: 2,
                    padding: 7,
                    paddingHorizontal: 9,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: 700 }}>⭐️ 4.5</Text>
                </View>
                <Text style={{ color: "#808080", paddingTop: 4 }}>
                  269 reviews
                </Text>
              </View>

              <Pressable onPress={() => setLiked(!liked)}>
                <View style={{ alignItems: "center", gap: 2 }}>
                  <Ionicons
                    name={liked ? "heart" : "heart-outline"}
                    size={32}
                    color="black"
                  />
                  <Text style={{ color: "#808080" }}>Like</Text>
                </View>
              </Pressable>

              <Pressable onPress={() => setTogo(!togo)}>
                <View style={{ alignItems: "center", gap: 2 }}>
                  <Ionicons
                    name={togo ? "bookmark" : "bookmark-outline"}
                    size={32}
                    color="black"
                  />
                  <Text style={{ color: "#808080" }}>To-go</Text>
                </View>
              </Pressable>

              <Pressable>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                    backgroundColor: "#C9C9C9",
                    borderRadius: 999,
                    padding: 8,
                    paddingHorizontal: 10,
                  }}
                >
                  <Ionicons
                    name="paper-plane-outline"
                    size={28}
                    color="white"
                  />
                  <Text style={{ color: "white", fontWeight: 600 }}>
                    Log a visit
                  </Text>
                </View>
              </Pressable>
            </View>

            <View style={{ paddingTop: 10, gap: 5 }}>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Text style={{ color: "#808080" }}>8:00AM - 10:00PM</Text>
                <Text style={{ color: "#808080", fontWeight: "700" }}>
                  See details
                </Text>
              </View>
              <Text style={{ color: "#808080" }}>{cafe.address}</Text>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </SafeAreaView>
  );
}
