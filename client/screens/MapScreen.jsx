import React, { useEffect, useState, useRef } from 'react'
import {
	View,
	ActivityIndicator,
	Dimensions,
	StyleSheet,
	Image,
	TouchableOpacity,
	Animated
} from 'react-native'
import { Marker } from 'react-native-maps'
import MapViewClustering from 'react-native-map-clustering'
import UserLocation from '../components/UserLocation'
import useParkingData from '../hooks/useParkingData'
import usePopupAnimation from '../hooks/usePopupAnimation'
import useUserLocation from '../hooks/useUserLocation'
import ParkingPopUp from '../components/ParkingPopUp'

const { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 2
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const INITIAL_POSITION = {
	latitude: 49.611622,
	longitude: 6.131935,
	latitudeDelta: LATITUDE_DELTA,
	longitudeDelta: LONGITUDE_DELTA
}

const MapScreen = ({ navigation, route }) => {
	const [selectedParkingSpot, setSelectedParkingSpot] = useState(
		route.params?.selectedParkingSpot
	)
	const { parkingData, loading } = useParkingData()
	const popupHeight = 700
	const { popupAnimation, animateOut } = usePopupAnimation(
		!!selectedParkingSpot,
		popupHeight
	)
	const closePopUp = () => {
		animateOut(() => {
			setSelectedParkingSpot(null)
		})
	}
	const mapViewRef = useRef(null)
	const { userLocation, handleUserLocationUpdate } = useUserLocation()

	useEffect(() => {
		if (route.params?.selectedParkingSpot) {
			setSelectedParkingSpot(route.params.selectedParkingSpot)
		}
	}, [route.params])

	useEffect(() => {
		if (userLocation && mapViewRef.current) {
			mapViewRef.current.animateToRegion(
				{
					latitude: userLocation.latitude,
					longitude: userLocation.longitude,
					latitudeDelta: 0.05,
					longitudeDelta: 0.05
				},
				1000
			)
		}
	}, [userLocation])

	useEffect(() => {
		if (selectedParkingSpot && mapViewRef.current) {
			mapViewRef.current.animateToRegion(
				{
					latitude: selectedParkingSpot.location.latitude,
					longitude: selectedParkingSpot.location.longitude,
					latitudeDelta: 0.05,
					longitudeDelta: 0.05
				},
				1000
			)
		}
	}, [selectedParkingSpot])

	if (loading) {
		return (
			<View className="flex-1 justify-center">
				<ActivityIndicator size="large" color="#363636" />
			</View>
		)
	}

	return (
		<View style={{ flex: 1 }}>
			<MapViewClustering
				style={StyleSheet.absoluteFillObject}
				initialRegion={INITIAL_POSITION}
				showsUserLocation={true}
				ref={mapViewRef}
			>
				{parkingData.map(item => (
					<Marker
						key={item.id}
						coordinate={item.location}
						onPress={() => setSelectedParkingSpot(item)}
					>
						<Image
							source={require('../../assets/icons/parking.png')}
							className="w-8 h-8 object-contain"
						/>
					</Marker>
				))}
			</MapViewClustering>

			<View className="absolute top-[650px] left-80">
				<UserLocation onLocationUpdate={handleUserLocationUpdate} />
			</View>
			{selectedParkingSpot && (
				<>
					<TouchableOpacity
						className="absolute top-0 left-0 right-0 bottom-0"
						onPress={closePopUp}
					/>
					<Animated.View
						className="absolute bottom-0 w-full"
						style={[
							{
								transform: [{ translateY: popupAnimation }]
							}
						]}
					>
						<ParkingPopUp
							parkingData={selectedParkingSpot}
							userLocation={userLocation}
							selectedParking={selectedParkingSpot}
						/>
					</Animated.View>
				</>
			)}
		</View>
	)
}

export default MapScreen
