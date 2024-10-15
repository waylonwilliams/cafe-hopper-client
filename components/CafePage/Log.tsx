import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect } from "react";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { cafeTags } from "./CafeTypes";
import EmojiTag from "../EmojiTag";

interface Props {
  setLoggingVisit: (arg: boolean) => void;
}

export default function Log({ setLoggingVisit }: Props) {
  const [rating, setRating] = useState(1);
  const [publicPost, setPublicPost] = useState(true);
  const [emojiTags, setEmojiTags] = useState<string[]>([]);

  function handleTagClick(tag: string) {
    if (emojiTags.includes(tag)) {
      setEmojiTags(emojiTags.filter((t) => t !== tag));
    } else {
      setEmojiTags([...emojiTags, tag]);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: "center",
        paddingVertical: 25,
        gap: 15,
        paddingHorizontal: 20,
      }}
    >
      <Pressable
        onPress={() => setLoggingVisit(false)}
        style={{ position: "absolute", top: 10, right: 10 }}
      >
        <Ionicons name="close" size={26} color="black" />
      </Pressable>

      <Text style={{ fontWeight: 700, fontSize: 24 }}>Log your visit</Text>

      {/* Star rating */}
      <View style={{ flexDirection: "row", gap: 5 }}>
        {[1, 2, 3, 4, 5].map((num) => (
          <Pressable onPress={() => setRating(num)} key={num}>
            <Ionicons
              name="star"
              size={30}
              color={num <= rating ? "#FFB400" : "#808080"}
            />
          </Pressable>
        ))}
      </View>

      <TextInput
        style={{
          height: 200,
          borderWidth: 1,
          width: "100%",
          padding: 10,
          borderRadius: 5,
          borderColor: "#808080",
        }}
        placeholder="Describe your visit..."
        multiline
      />

      <Pressable
        style={{
          flexDirection: "row",
          gap: 6,
          borderRadius: 999,
          backgroundColor: "#CCCCCC",
          padding: 10,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="image-outline" size={24} color="white" />
        <Text style={{ color: "white", fontWeight: 700 }}>Add photos</Text>
      </Pressable>

      {/* Went with someone should go here */}

      <View style={{ flexDirection: "row", gap: 5, flexWrap: "wrap" }}>
        {cafeTags.map((tag, index) => (
          <Pressable onPress={() => handleTagClick(tag)} key={index}>
            <EmojiTag
              key={index}
              tag={tag}
              filled={emojiTags.includes(tag) ? true : undefined}
            />
          </Pressable>
        ))}
      </View>

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Pressable
          style={{
            flexDirection: "row",
            gap: 6,
            borderRadius: 999,
            backgroundColor: "#CCCCCC",
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <Ionicons name="paper-plane-outline" size={24} color="white" />
          <Text style={{ color: "white", fontWeight: 700 }}>Post</Text>
        </Pressable>

        <Pressable
          style={{ alignItems: "center", gap: 3 }}
          onPress={() => setPublicPost(true)}
        >
          <Ionicons
            name="globe-outline"
            size={20}
            color={publicPost ? "black" : "#808080"}
          />
          <Text style={{ color: publicPost ? "black" : "#808080" }}>
            Public
          </Text>
        </Pressable>

        <Pressable
          style={{ alignItems: "center", gap: 3 }}
          onPress={() => setPublicPost(false)}
        >
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={!publicPost ? "black" : "#808080"}
          />
          <Text style={{ color: !publicPost ? "black" : "#808080" }}>
            Private
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
