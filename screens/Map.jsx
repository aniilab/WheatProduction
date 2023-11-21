import * as React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Callout, Circle, Marker } from "react-native-maps";
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';

export default function MapComponent() {
	const [pin, setPin] = React.useState({
		latitude: 49.842957,
		longitude: 24.031111,
	});
	const [region, setRegion] = React.useState({
		latitude: 49.842957, 
		longitude: 24.031111,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421
	});
	const [userLocation, setUserLocation] = React.useState(null);
	const [polylineCoordinates, setPolylineCoordinates] = React.useState([]);

	React.useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				console.error('Permission to access location was denied');
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			setUserLocation({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude
			});
		})();
	}, []);

	const getDirections = async () => {
		try {
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/directions/json?origin=${userLocation.latitude},${userLocation.longitude}&destination=${pin.latitude},${pin.longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
			);

			const data = await response.json();

			if (data.routes.length) {
				const points = data.routes[0].overview_polyline.points;
				const decodedPoints = decodePolyline(points);
				setPolylineCoordinates(decodedPoints);
			} else {
				// console.error('No route found');
			}
		} catch (error) {
			console.error('Error getting directions:', error);
		}
	};

	const decodePolyline = (polyline) => {
		let points = [];
		let index = 0;
		const len = polyline.length;
		let lat = 0;
		let lng = 0;

		while (index < len) {
			let b;
			let shift = 0;
			let result = 0;
			do {
				b = polyline.charCodeAt(index++) - 63;
				result |= (b & 0x1f) << shift;
				shift += 5;
			} while (b >= 0x20);

			const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
			lat += dlat;

			shift = 0;
			result = 0;
			do {
				b = polyline.charCodeAt(index++) - 63;
				result |= (b & 0x1f) << shift;
				shift += 5;
			} while (b >= 0x20);

			const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
			lng += dlng;

			points.push({
				latitude: lat / 1e5,
				longitude: lng / 1e5
			});
		}

		return points;
	};

	React.useEffect(() => {
		if (userLocation) {
			getDirections();
		}
	}, [userLocation, pin]);

	return (
		<View style={{ flex: 1 }}>
			<GooglePlacesAutocomplete
				placeholder="Search"
				fetchDetails={true}
				GooglePlacesSearchQuery={{
					rankby: "distance"
				}}
				onPress={(data, details = null) => {
					console.log(data, details);
					setRegion({
						latitude: details.geometry.location.lat,
						longitude: details.geometry.location.lng,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421
					});
					setPin({
						latitude: details.geometry.location.lat,
						longitude: details.geometry.location.lng
					});
				}}
				query={{
					key: "",
					language: "en",
					components: "country:ua",
					types: "establishment",
					radius: 30000,
					location: `${region.latitude}, ${region.longitude}`
				}}
				styles={{
					container: { flex: 0, position: "absolute", width: "100%", zIndex: 1 },
					listView: { backgroundColor: "white" }
				}}
			/>
			<MapView
				style={styles.map}
				region={userLocation ? {
					latitude: userLocation.latitude,
					longitude: userLocation.longitude,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421
				} : region}
				provider="google"
			>
				{userLocation && (
					<Marker coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }} />
				)}
				<Marker
					coordinate={pin}
					pinColor="black"
					draggable={true}
					onDragStart={(e) => {
						console.log("Drag start", e.nativeEvent.coordinates);
					}}
					onDragEnd={(e) => {
						setPin({
							latitude: e.nativeEvent.coordinate.latitude,
							longitude: e.nativeEvent.coordinate.longitude
						});
						setUserLocation({
							latitude: e.nativeEvent.coordinate.latitude,
							longitude: e.nativeEvent.coordinate.longitude
						});
						getDirections();
					}}
				>
					<Callout>
						<Text>I'm here</Text>
					</Callout>
				</Marker>
				<Circle center={pin} radius={1000} />
				<MapViewDirections
					origin={userLocation}
					destination={pin}
					apikey="AIzaSyC7EdSBr2rAHxn1LtJJauW-Be4IRpliNH4"
					strokeWidth={2}
					strokeColor="blue"
				/>
			</MapView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center"
	},
	map: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height
	}
});
