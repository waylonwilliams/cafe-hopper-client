import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { useState, useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

interface Props {
  setLoggingVisit: (arg: boolean) => void;
}

export default function Log({ setLoggingVisit }: Props) {
  return (
    <ScrollView
      contentContainerStyle={{ alignItems: "center", paddingTop: 15 }}
    >
      <Pressable
        onPress={() => setLoggingVisit(false)}
        style={{ position: "absolute", top: 0, right: 15 }}
      >
        <Ionicons name="close" size={26} color="black" />
      </Pressable>

      <Text style={{ fontWeight: 700, fontSize: 24 }}>Log your visit</Text>
    </ScrollView>
  );
}
