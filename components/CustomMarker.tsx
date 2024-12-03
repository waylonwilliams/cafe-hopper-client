import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { CafeType } from './CafePage/CafeTypes'; // Import icon libraries

// Define the type for marker prop
export interface MarkerType {
  name: string;
  rating: string;
  latitude: number;
  longitude: number;
  category?: 'liked' | 'saved' | 'default';
  cafe: CafeType;
}
// Component to render a custom map marker with scaling and category-specific styles
const CustomMarker: React.FC<{ marker: MarkerType; scale: number }> = ({ marker, scale }) => {
  // Dynamically calculate sizes based on the scale
  const iconSize = 14 * scale;
  const textSize = 12 * scale;
  const containerSize = 25 * scale;

  let IconComponent; // Icon to render (based on the category)
  let iconBackgroundStyle; // Background styling for the icon

  // Determine icon and background style based on the marker's category
  switch (marker.category) {
    case 'liked':
      IconComponent = <FontAwesome name="heart" size={iconSize} color="white" />;
      iconBackgroundStyle = styles.likedIconBackground;
      break;
    case 'saved':
      IconComponent = <MaterialIcons name="bookmark" size={iconSize} color="white" />;
      iconBackgroundStyle = styles.savedIconBackground;
      break;
    default:
      IconComponent = <FontAwesome name="coffee" size={iconSize} color="white" />;
      iconBackgroundStyle = styles.defaultIconBackground;
      break;
  }

  return (
    <View style={[styles.wrapper, { transform: [{ scale }] }]}>
      <View
        style={[
          styles.iconBackground,
          iconBackgroundStyle,
          { width: containerSize, height: containerSize },
        ]}>
        {IconComponent}
      </View>
      <Text style={[styles.markerName, { fontSize: textSize }]}>{marker.name}</Text>
    </View>
  );
};

// Styles for different marker categories and tooltip
const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column', // Arrange icon and text in a row
    alignItems: 'center', // Align items vertically
  },
  iconBackground: {
    width: 25,
    height: 25,
    borderRadius: 16, // Ensures the background is circular
    justifyContent: 'center',
    alignItems: 'center',
  },
  likedIconBackground: {
    backgroundColor: 'black',
  },
  savedIconBackground: {
    backgroundColor: 'black',
  },
  defaultIconBackground: {
    backgroundColor: 'black',
  },
  markerName: {
    marginLeft: 7, // Add space between the icon and text
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7b7b7b',
  },
});

export default React.memo(CustomMarker);
