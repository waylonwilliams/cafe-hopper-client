import React from "react";
import { Text, View } from "react-native";

interface Props {
  name: string;
  emoji: string;
}

export default function EmojiTag({ name, emoji }: Props) {
  return (
    <View style={{ borderWidth: 1, borderRadius: 999 }}>
      <Text style={{ padding: 6, fontWeight: 600 }}>{emoji + name}</Text>
    </View>
  );
}
