import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import EmojiTag from "@/components/EmojiTag";
import Review from "@/components/Review";
import { CafeType, ReviewType } from "./CafeTypes";

interface Props {
  cafe: CafeType;
  reviews: ReviewType[];
  logVisit: () => void;
}

export default function Cafe({ cafe, reviews, logVisit }: Props) {
  const [liked, setLiked] = useState(false);
  const [togo, setTogo] = useState(false);
  const [showHours, setShowHours] = useState(false);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

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
    <ScrollView
      style={{
        padding: 5,
        paddingHorizontal: 25,
      }}
      contentContainerStyle={{
        gap: 10,
        paddingBottom: 30,
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
          <Text style={{ color: "#808080", paddingTop: 4 }}>269 reviews</Text>
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

        <Pressable onPress={logVisit}>
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
            <Ionicons name="paper-plane-outline" size={28} color="white" />
            <Text style={{ color: "white", fontWeight: 600 }}>Log a visit</Text>
          </View>
        </Pressable>
      </View>

      {/* Opening time and address */}
      <View style={{ paddingTop: 5, gap: 5 }}>
        {showHours && (
          <View style={{ gap: 4 }}>
            {days.map((day, index) => (
              <View style={{ width: "100%", flexDirection: "row" }} key={index}>
                <Text style={{ width: "30%", color: "#808080" }}>{day}</Text>
                <Text style={{ color: "#808080" }}>8:00AM - 10:00PM</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ flexDirection: "row", gap: 10 }}>
          {!showHours && (
            <Text style={{ color: "#808080" }}>8:00AM - 10:00PM</Text>
          )}
          <Pressable onPress={() => setShowHours(!showHours)}>
            <Text style={{ color: "#808080", fontWeight: "700" }}>
              {showHours ? "Hide" : "See details"}
            </Text>
          </Pressable>
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
        <EmojiTag tag="🍵 Matcha" />
        <EmojiTag tag="🛜 Free Wifi" />
        <EmojiTag tag="🌱 Vegan" />
        <EmojiTag tag="🌳 Outdoor" />
        <EmojiTag tag="🐶 Pet Friendly" />
        <EmojiTag tag="🏠 Indoor" />
        <EmojiTag tag="🚗 Parking" />
        <EmojiTag tag="❄️ Air Conditioned" />
        <EmojiTag tag="♿️ Wheelchair Accessible" />
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

            <Text style={{ color: "#808080" }}>{totalReviews} reviews</Text>
          </View>
        </View>
      </View>

      {/* Reviews */}
      <Text style={{ paddingTop: 10, fontSize: 18, fontWeight: 600 }}>
        Popular reviews
      </Text>

      {/* Should map them */}
      {reviews.map((review, index) => (
        <Review review={review} key={index} />
      ))}
    </ScrollView>
  );
}
