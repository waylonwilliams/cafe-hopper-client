import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, Pressable, Text, View } from "react-native";
import EmojiTag from "./EmojiTag";

type Review = {
  name: string;
  description: string;
  tags: string[]; // hopefully we can store as "<emoji> <tag>" all in one string
  numLikes: number;
  datePosted: string; // supabase timestamp string
  score: number;
  images: string[]; // urls
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
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
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

      <View style={{ flex: 1, gap: 8 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{ color: "#808080", fontWeight: 700, paddingRight: 4 }}
            >
              {review.name}
            </Text>
            {[...Array(review.score)].map((_, index) => (
              <Ionicons key={index} name="star" size={11} color="#FFB400" />
            ))}
          </View>

          <Text style={{ color: "#808080" }}>{date}</Text>
        </View>

        <Text style={{ paddingRight: 15 }}>{review.description}</Text>

        <View style={{ flexDirection: "row", gap: 5 }}>
          {review.images.slice(0, 2).map((image, index) => (
            <Image
              source={{ uri: image }}
              style={{
                width: "38%",
                height: 96,
                borderRadius: 10,
              }}
            />
          ))}
          {/* Clicking this would hopefully open full view images */}
          {review.images.length > 2 && (
            <Pressable
              style={{
                flex: 1,
                backgroundColor: "#D9D9D9",
                borderRadius: 10,
                justifyContent: "center",
              }}
            >
              <Text
                style={{ textAlign: "center", fontSize: 24, color: "#808080" }}
              >
                +{review.images.length - 2}
              </Text>
            </Pressable>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 5,
            flexWrap: "wrap",
            paddingTop: 5,
          }}
        >
          {review.tags.map((tag, index) => (
            <EmojiTag key={index} tag={tag} />
          ))}
        </View>
      </View>
    </View>
  );
}
