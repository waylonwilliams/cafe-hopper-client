import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons"; // Import icon libraries

// Define the type for marker prop
export interface MarkerType {
	name: string;
	rating: string;
	latitude: number;
	longitude: number;
	category?: "liked" | "saved" | "default";
}

// CustomMarker component
const CustomMarker: React.FC<{ marker: MarkerType }> = ({ marker }) => {
	// Determine the icon and background color based on the category
	let IconComponent;
	let iconBackgroundStyle;

	switch (marker.category) {
		case "liked":
			IconComponent = <FontAwesome name="heart" size={14} color="white" />;
			iconBackgroundStyle = styles.likedIconBackground;
			break;
		case "saved":
			IconComponent = <MaterialIcons name="bookmark" size={16} color="white" />;
			iconBackgroundStyle = styles.savedIconBackground;
			break;
		default:
			IconComponent = <FontAwesome name="coffee" size={14} color="white" />;
			iconBackgroundStyle = styles.defaultIconBackground;
			break;
	}

	return (
		<View style={styles.wrapper}>
			<View style={[styles.tooltipContainer]}>
				{/* Icon with circular background and Tooltip Text */}
				<View style={styles.iconAndText}>
					<View style={[styles.iconBackground, iconBackgroundStyle]}>
						{IconComponent}
					</View>
					<Text style={styles.tooltipText}>{marker.rating}</Text>
				</View>
			</View>
			<View style={styles.tooltipArrow} />
			<Text>{marker.name} </Text>
		</View>
	);
};

// Styles for different marker categories and tooltip
const styles = StyleSheet.create({
	wrapper: {
		position: "absolute",
		bottom: 0,
		alignItems: "center",
	},
	// Tooltip container with white background and black border
	tooltipContainer: {
		backgroundColor: "white",
		borderColor: "#9AA0A6", // Black border
		borderWidth: 2,
		paddingVertical: 2,
		paddingHorizontal: 6,
		paddingRight: 9,
		borderRadius: 20,
		zIndex: 1, // Ensure container is above the arrow
		alignItems: "center",
	},
	tooltipText: {
		color: "black", // Black text to contrast with white background
		fontSize: 16,
		fontWeight: "semibold",
		marginLeft: 5, // Space between icon and text
	},
	tooltipArrow: {
		width: 16,
		height: 16,
		backgroundColor: "white", // White background for the arrow
		borderLeftWidth: 2,
		borderBottomWidth: 2,
		borderColor: "#9AA0A6", // Black border for the arrow
		transform: [{ rotate: "-45deg" }], // Arrow shape
		zIndex: 2, // Ensure arrow is below the container
		marginTop: -8, // Adjust to bring the arrow closer to the container
	},
	iconAndText: {
		flexDirection: "row", // Align icon and text horizontally
		alignItems: "center",
	},
	// Circular background for icons
	iconBackground: {
		width: 25,
		height: 25,
		borderRadius: 16, // Ensures the background is circular
		justifyContent: "center",
		alignItems: "center",
	},
	// Specific background colors for each category
	likedIconBackground: {
		backgroundColor: "black",
	},
	savedIconBackground: {
		backgroundColor: "black",
	},
	defaultIconBackground: {
		backgroundColor: "black",
	},
});

export default CustomMarker;
