import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { useState, useEffect } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

interface Props {
  setLoggingVisit: (arg: boolean) => void;
}

export default function Log({ setLoggingVisit }: Props) {
  const [rating, setRating] = useState(1);

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: "center",
        paddingTop: 25,
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
          <Pressable onPress={() => setRating(num)}>
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
    </ScrollView>
  );
}
