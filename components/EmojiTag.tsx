import React from "react";
import { Text, View } from "react-native";

interface Props {
  tag: string;
}

export default function EmojiTag({ tag }: Props) {
  return (
    <View style={{ borderWidth: 1, borderRadius: 999 }}>
      <Text style={{ padding: 6, fontWeight: 600 }}>{tag}</Text>
    </View>
  );
}