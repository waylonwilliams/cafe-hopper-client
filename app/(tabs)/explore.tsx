import {
	Alert,
	Text,
	View,
	SafeAreaView,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
} from "react-native";
import MapView, {
	Callout,
	PROVIDER_GOOGLE,
	Marker,
	Region,
} from "react-native-maps";
import React, { useEffect, useState, useRef } from "react";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { markers } from "../../assets/markers";
import { MarkerType } from "../../components/CustomMarker";
import CustomMarker from "../../components/CustomMarker";
import { Link, useRouter } from "expo-router";

export default function Map() {
	const [mapRegion, setMapRegion] = useState({
		latitude: 5.603717,
		longitude: -0.186964,
		latitudeDelta: 0.005,
		longitudeDelta: 0.005,
	});

	const mapRef = useRef<MapView>(null); // Reference to the MapView
	const router = useRouter(); // Get the router instance from expo-router

	const userLocation = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			console.log("Permission to access location was denied");
			return;
		}
		let location = await Location.getCurrentPositionAsync({
			accuracy: Location.Accuracy.High,
		});
		const newRegion = {
			latitude: location.coords.latitude,
			longitude: location.coords.longitude,
			latitudeDelta: 0.005,
			longitudeDelta: 0.005,
		};
		setMapRegion(newRegion);

		// Animate the map to the new region
		if (mapRef.current) {
			mapRef.current.animateToRegion(newRegion, 1000);
		}
	};

	const handleMarkerPress = (marker: MarkerType) => {
		// Navigate to cafe view and pass marker data as parameters
		console.log(`Navigating to cafe view for: ${marker.name}`);
		router.push({
			pathname: "/cafe",
			params: {
				id: 1,
				name: "Cafe Oshima's",
				address:
					"2/37 Cao Thang, Ward 5, District 3, Ho Chi Minh City, Vietnam",
				topTags: [
					"🍵 Matcha",
					"🛜 Free Wifi",
					"🌱 Vegan",
					"🌳 Outdoor",
					"🐶 Pet Friendly",
					"🏠 Indoor",
					"🚗 Parking",
				],
				hours: `8:00AM - 10:00PM Monday
                    8:00AM - 10:00PM Tuesday
                    8:00AM - 10:00PM Wednesday
                    8:00AM - 10:00PM Thursday
                    8:00AM - 10:00PM Friday
                    8:00AM - 10:00PM Saturday
                    8:00AM - 10:00PM Sunday`,
			},
		});
	};

	useEffect(() => {
		userLocation();
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<TouchableOpacity style={styles.location} onPress={userLocation}>
				<Text>
					<MaterialIcons name="my-location" size={24} color="black" />
				</Text>
			</TouchableOpacity>
			<MapView
				ref={mapRef} // Attach reference to MapView
				style={styles.map}
				initialRegion={mapRegion}
				region={mapRegion}
				showsUserLocation={true} // Show the default blue dot for user location
				followsUserLocation={true}
				showsMyLocationButton={true}
				mapType="standard"
			>
				{markers.map((marker, index) => {
					const validMarker: MarkerType = {
						...marker,
						category: marker.category as
							| "liked"
							| "saved"
							| "default"
							| undefined,
					};
					return (
						<Marker
							key={index}
							coordinate={marker}
							onPress={() => handleMarkerPress(validMarker)}
							// onPress={() => console.log("presseed")}
						>
							<CustomMarker marker={validMarker} />
						</Marker>
					);
				})}
			</MapView>
		</View>
	);
}

const styles = StyleSheet.create({
	map: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
	},
	location: {
		position: "absolute",
		zIndex: 50,
		bottom: 10,
		right: 10,
		backgroundColor: "white",
		padding: 10,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
	},
	customMarker: {
		alignItems: "center",
	},
});
