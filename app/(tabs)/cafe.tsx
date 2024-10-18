import { router } from "expo-router";
import { Image, Pressable, SafeAreaView, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet, {
  BottomSheetHandleProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useMemo, useRef, useState } from "react";
import Cafe from "@/components/CafePage/Cafe";
import Log from "@/components/CafePage/Log";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { CafeType } from "@/components/CafePage/CafeTypes";

/**
 * An example of how you can open this page
 * <Link
        // will pass the fetched cafe data like this to prevent multiple fetches
        href={{
          pathname: "/cafe",
          params: {
            id: 1,
            name: "Cafe Oshima's",
            address:
              "2/37 Cao Thang, Ward 5, District 3, Ho Chi Minh City, Vietnam",
            topTags: [
              "🍵 Matcha",
              "🛜 Free Wifi",
              "🌱 Vegan",
              "🌳 Outdoor",
              "🐶 Pet Friendly",
              "🏠 Indoor",
              "🚗 Parking",
            ],
            hours: `8:00AM - 10:00PM Monday
                    8:00AM - 10:00PM Tuesday
                    8:00AM - 10:00PM Wednesday
                    8:00AM - 10:00PM Thursday
                    8:00AM - 10:00PM Friday
                    8:00AM - 10:00PM Saturday
                    8:00AM - 10:00PM Sunday`,
          },
        }}
        asChild
      >
        <Pressable>
          <Text>Open cafe view</Text>
        </Pressable>
      </Link>
 */

/**
 * When you click on a cafe card / pin on map this page will be shown
 * Ideally upgrade this to take in a cafe as a param and render it that way
 */
export default function Index() {
  const cafeObj = useLocalSearchParams() as CafeType;

  const [loggingVisit, setLoggingVisit] = useState(false);

  // idk stuff for the bottom sheet
  const bottomSheetRef = useRef<BottomSheet>(null);
  //   const handleSheetChanges = useCallback((index: number) => {}, []);
  const snapPoints = useMemo(() => ["75%", "95%"], []); // 95% so you can see back button
  // differnt top handle components for if you are viewing the cafe or if you are logging your visit
  const HandleComponent: React.FC<BottomSheetHandleProps> = (props) => {
    return loggingVisit ? (
      <></>
    ) : (
      <View style={{ width: "100%", alignItems: "center", padding: 10 }}>
        <View
          style={{
            backgroundColor: "#808080",
            width: 100,
            height: 5,
            borderRadius: 999,
            opacity: 0.5,
          }}
        />
      </View>
    );
  };

  function logVisit() {
    setLoggingVisit(true);
    bottomSheetRef.current?.snapToIndex(1);
  }

  function goBack() {
    setLoggingVisit(false);
    router.back();
  }

  const review = {
    name: "Jane Doe",
    description:
      "This cafe has quickly become my go-to for a peaceful break. The ambiance is so calm and relaxing, perfect for unwinding or getting some work done. The staff really knows their stuff when it comes to coffee, and their recommendations never disappoint. Plus, their music selection is always on point—just the right vibe without being too loud. It’s a hidden gem!",
    tags: ["🌱 Vegan", "🍵 Matcha", "🛜 Free Wifi", "🌳 Outdoor"],
    numLikes: 169,
    datePosted: "2021-09-01T12:00:00Z",
    score: 5,
    images: [
      "https://jghggbaesaohodfsneej.supabase.co/storage/v1/object/public/page_images/public/60d09661-18af-43b5-bcb8-4c5a0b2dbe12",
      "https://jghggbaesaohodfsneej.supabase.co/storage/v1/object/public/page_images/public/60d09661-18af-43b5-bcb8-4c5a0b2dbe12",
      "https://jghggbaesaohodfsneej.supabase.co/storage/v1/object/public/page_images/public/60d09661-18af-43b5-bcb8-4c5a0b2dbe12",
    ],
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

        <Pressable onPress={goBack}>
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
          handleComponent={HandleComponent}
        >
          <BottomSheetView
            style={{
              width: "100%",
              height: "100%",
              paddingTop: 5,
            }}
          >
            {loggingVisit ? (
              <Log setLoggingVisit={setLoggingVisit} />
            ) : (
              <Cafe
                cafe={cafeObj}
                reviews={[review, review, review]}
                logVisit={logVisit}
              />
            )}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </SafeAreaView>
  );
}
