import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { useState, useEffect } from "react";
import { Pressable, ScrollView, Text } from "react-native";

interface Props {
  setLoggingVisit: (arg: boolean) => void;
}

export default function Log({ setLoggingVisit }: Props) {
  return (
    <ScrollView contentContainerStyle={{ alignItems: "center" }}>
      <Pressable style={{ position: "absolute", right: 5, top: 0 }}>
        <Ionicons name="close" size={24} color="black" />
      </Pressable>

      <Text style={{ fontWeight: 700, fontSize: 24 }}>Log your visit</Text>
    </ScrollView>
  );
}
