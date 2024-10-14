import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

type Review = {
  name: string;
  description: string;
  tags: string[]; // hopefully we can store as "<emoji> <tag>" all in one string
  numLikes: number;
  datePosted: string; // supabase timestamp string
  score: number;
};

interface Props {
  review: Review;
}

export default function Review({ review }: Props) {
  const date = new Date(review.datePosted).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <View
      style={{
        width: "100%",
        borderWidth: 2,
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        gap: 15,
        position: "relative",
      }}
    >
      {/* Pfp */}
      <View
        style={{
          width: 35,
          height: 35,
          backgroundColor: "purple",
          borderRadius: 999,
        }}
      ></View>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: "#808080", fontWeight: 700 }}>Name</Text>
            {[...Array(review.score)].map((_, index) => (
              <Ionicons key={index} name="star" size={16} color="gold" />
            ))}
          </View>

          <Text style={{ color: "#808080" }}>{date}</Text>
        </View>

        <Text>{review.description}</Text>
      </View>
    </View>
  );
}
