import React from 'react';
import { Text, View } from 'react-native';

interface Props {
  tag: string;
  filled?: boolean;
}

export default function EmojiTag({ tag, filled }: Props) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderRadius: 999,
        backgroundColor: filled ? '#CCCCCC' : 'white',
      }}>
      <Text style={{ padding: 6, fontWeight: 600 }}>{tag}</Text>
    </View>
  );
}
