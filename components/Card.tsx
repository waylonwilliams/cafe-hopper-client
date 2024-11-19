import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type Card = {
  name: string;
  imageUri?: string;
  localImage?: any;
  rating: number;
  tags: string[];
};

interface CardProps {
  card: Card;
}

export default function CardComponent({ card }: CardProps) {
  return (
    <View style={styles.card}>
      {/* Preview Image*/}
      {card.localImage ? (
        <Image source={card.localImage} style={styles.image}></Image>
      ) : (
        <Image source={{ uri: card.imageUri }} style={styles.image}></Image>
      )}

      <View style={styles.content}>
        {/* Cafe Name */}
        <Text style={styles.name}>{card.name}</Text>
        {/* Rating */}
        <View style={styles.ratingContainer}>
          <Icon name="star" size={11} color="gold"></Icon>
          <Text style={styles.rating}>{card.rating}</Text>
        </View>
      </View>

      {/* Tags */}
      <View style={styles.tagContainer}>
        {card.tags.map((item, index) => (
          <Text key={index} style={styles.tag}>
            {item}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 200,
    margin: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 15,
  },

  image: {
    width: '100%',
    height: 150,
  },

  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  name: {
    fontSize: 11,
    fontFamily: 'SF-Pro-Display-Regular',
    margin: 7,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },

  rating: {
    fontSize: 9,
    marginLeft: 5,
  },

  tagContainer: {
    marginLeft: 9,
    marginBottom: 5,
    flexDirection: 'row',
  },

  tag: {
    fontSize: 11,
  },
});
