import { Text, SafeAreaView, StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
export default function Index() {
	return (
		<SafeAreaView
			style={{
				flex: 1,
				// justifyContent: "center",
				// alignItems: "center",
			}}
		>
			<MapView
				provider={PROVIDER_GOOGLE}
				style={StyleSheet.absoluteFillObject}
				initialRegion={{
					latitude: 36.9940514,
					longitude: -122.0650572,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				}}
			/>
		</SafeAreaView>
	);
}
