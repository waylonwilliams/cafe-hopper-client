import { router } from "expo-router";
import { Image, Pressable, SafeAreaView, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useMemo, useRef, useState } from "react";
import EmojiTag from "@/components/EmojiTag";
import Review from "@/components/Review";
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
    reviews: {
      one: 2,
      two: 0,
      three: 10,
      four: 19,
      five: 23,
    },
  };

  const review = {
    name: "Jane Doe",
    description:
      "This cafe has quickly become my go-to for a peaceful break. The ambiance is so calm and relaxing, perfect for unwinding or getting some work done. The staff really knows their stuff when it comes to coffee, and their recommendations never disappoint. Plus, their music selection is always on point—just the right vibe without being too loud. It’s a hidden gem!",
    tags: ["🌱 Vegan", "🍵 Matcha", "🛜 Free Wifi", "🌳 Outdoor"],
    numLikes: 169,
    datePosted: "2021-09-01T12:00:00Z",
    score: 5,
  };

  // to convert the string key to a number
  const keyToNumber: { [key: string]: number } = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
  };

  // can use for getting width of bar
  const maxReviewValue = Math.max(...Object.values(cafe.reviews));
  const totalReviews = Object.values(cafe.reviews).reduce(
    (acc, review) => acc + review,
    0
  );
  const averageReview =
    totalReviews === 0
      ? 0
      : Object.entries(cafe.reviews).reduce(
          (acc, [key, value]) => acc + keyToNumber[key] * value,
          0
        ) / totalReviews;

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
              padding: 10,
              paddingHorizontal: 25,
              flex: 1,
              flexDirection: "column",
              gap: 15,
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

            {/* Opening time and address */}
            <View style={{ paddingTop: 5, gap: 5 }}>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Text style={{ color: "#808080" }}>8:00AM - 10:00PM</Text>
                <Text style={{ color: "#808080", fontWeight: "700" }}>
                  See details
                </Text>
              </View>
              <Text style={{ color: "#808080" }}>{cafe.address}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 5,
                flexWrap: "wrap",
                paddingTop: 5,
              }}
            >
              <EmojiTag name="Matcha" emoji="🍵" />
              <EmojiTag name="Free Wifi" emoji="🛜" />
              <EmojiTag name="Vegan" emoji="🌱" />
              <EmojiTag name="Outdoor" emoji="🌳" />
              <EmojiTag name="Pet Friendly" emoji="🐶" />
              <EmojiTag name="Indoor" emoji="🏠" />
              <EmojiTag name="Parking" emoji="🚗" />
              <EmojiTag name="Air Conditioned" emoji="❄️" />
              <EmojiTag name="Wheelchair Accessible" emoji="♿️" />
            </View>

            {/* Reviews scales here */}
            <View style={{ gap: 10 }}>
              <Text style={{ fontSize: 24, fontWeight: 600, paddingTop: 5 }}>
                Reviews
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "65%", gap: 10, position: "relative" }}>
                  {Object.entries(cafe.reviews)
                    .reverse()
                    .map((review, index) => (
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 4,
                          alignItems: "center",
                        }}
                        key={index}
                      >
                        <Text style={{ color: "#808080" }}>
                          {keyToNumber[review[0]]}
                        </Text>
                        <View
                          style={{
                            width: "100%",
                            backgroundColor: "#C9C9C9",
                            borderRadius: 3,
                            margin: 2,
                            position: "relative",
                            height: 7,
                          }}
                        >
                          <View
                            style={{
                              width: `${(review[1] / maxReviewValue) * 100}%`,
                              backgroundColor: "#FFB400",
                              borderRadius: 3,
                              padding: 2,
                              height: 7,
                            }}
                          />
                        </View>
                      </View>
                    ))}
                </View>

                <View
                  style={{
                    width: "25%",
                    paddingLeft: 10,
                    paddingTop: 5,
                    gap: 5,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Ionicons name="star" size={24} color="#FFB400" />
                    <Text style={{ fontSize: 24, fontWeight: 600 }}>
                      {averageReview.toFixed(1)}
                    </Text>
                  </View>

                  <Text style={{ color: "#808080" }}>
                    {totalReviews} reviews
                  </Text>
                </View>
              </View>
            </View>

            {/* Reviews */}
            {/* Should map them */}
            <Review review={review} />
          </BottomSheetView>
        </BottomSheet>
      </View>
    </SafeAreaView>
  );
}
