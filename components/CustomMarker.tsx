import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// Define the type for marker prop
export interface MarkerType {
	name: string;
	latitude: number;
	longitude: number;
	category?: "liked" | "saved" | "default";
}

// CustomMarker component
const CustomMarker: React.FC<{ marker: MarkerType }> = ({ marker }) => {
	// Determine the marker style based on the category
	let markerStyle;
	let iconColor;

	switch (marker.category) {
		case "liked":
			markerStyle = styles.likedMarker;
			iconColor = "red";
			break;
		case "saved":
			markerStyle = styles.savedMarker;
			iconColor = "blue";
			break;
		default:
			markerStyle = styles.defaultMarker;
			iconColor = "black";
			break;
	}

	return (
		<View style={[styles.customMarker, markerStyle]}>
			<MaterialIcons name="place" size={40} color={iconColor} />
			<Text style={styles.markerText}>{marker.name}</Text>
		</View>
	);
};

// Styles for different marker categories
const styles = StyleSheet.create({
	customMarker: {
		alignItems: "center",
	},
	likedMarker: {
		// Style for liked markers
	},
	savedMarker: {
		// Style for saved markers
	},
	defaultMarker: {
		// Style for default markers
	},
	markerText: {
		color: "black",
		fontWeight: "bold",
	},
});

export default CustomMarker;
