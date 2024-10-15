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

export default function Map() {
	const [mapRegion, setMapRegion] = useState({
		latitude: 5.603717,
		longitude: -0.186964,
		latitudeDelta: 0.005,
		longitudeDelta: 0.005,
	});

	const mapRef = useRef<MapView>(null); // Reference to the MapView

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

	const calloutPressed = (ev: any) => {
		console.log(ev);
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
						<Marker key={index} coordinate={marker}>
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
	markerText: {
		color: "black",
		fontWeight: "bold",
	},
});
