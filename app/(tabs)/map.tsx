import { Text, SafeAreaView, StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		height: 400,
		width: 400,
		justifyContent: "flex-end",
		alignItems: "center",
	},
	map: {
		...StyleSheet.absoluteFillObject,
	},
});
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
