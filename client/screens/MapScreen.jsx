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
import MapView, { Marker } from 'react-native-maps'
import MapViewClustering from 'react-native-map-clustering'
import { useRoute } from '@react-navigation/native'
import UserLocation from '../components/UserLocation'
import { fetchParkingData } from '../util/parkingService'
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

const MapScreen = ({ navigation }) => {
	const [parkingData, setParkingData] = useState([])
	const [userLocation, setUserLocation] = useState(null)
	const [loading, setLoading] = useState(true)
	const [selectedParkingSpot, setSelectedParkingSpot] = useState(null)
	const popupAnimation = useRef(new Animated.Value(0)).current

	const mapViewRef = useRef(null)

	useEffect(() => {
		const transformData = data => {
			return data.map(item => ({
				...item,
				location: {
					latitude: item.lat,
					longitude: item.lon
				}
			}))
		}

		const loadParkingData = async () => {
			try {
				const data = await fetchParkingData()
				const transformedData = transformData(data)
				setParkingData(transformedData)
			} catch (error) {
				console.error('Error loading parking data:', error)
			} finally {
				setLoading(false)
			}
		}

		loadParkingData()
	}, [])

	useEffect(() => {
		if (selectedParkingSpot) {
			// Animate pop-up in
			Animated.timing(popupAnimation, {
				toValue: 50, // On-screen position
				duration: 300,
				useNativeDriver: true
			}).start()
		}
	}, [selectedParkingSpot])

	const closePopUp = () => {
		Animated.timing(popupAnimation, {
			toValue: 700, // Off-screen position
			duration: 300,
			useNativeDriver: true
		}).start(() => {
			setSelectedParkingSpot(null)
		})
	}

	// Focus on selected parking when parameter changes
	useEffect(() => {
		if (selectedParkingSpot && mapViewRef.current) {
			mapViewRef.current.animateToRegion(
				{
					latitude: selectedParkingSpot.location.latitude,
					longitude: selectedParkingSpot.location.longitude,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01
				},
				1000
			)
		}
	}, [selectedParkingSpot])

	const handleUserLocationUpdate = location => {
		if (!location) {
			console.log('User location is not available.')
			return
		}

		setUserLocation(location)
		if (mapViewRef.current) {
			mapViewRef.current.animateToRegion(
				{
					latitude: location.latitude,
					longitude: location.longitude,
					latitudeDelta: 0.05,
					longitudeDelta: 0.05
				},
				1000
			)
		}
	}

	if (loading) {
		return (
			<View className=" flex-1 justify-center">
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
							className=" w-8 h-8 object-contain"
						/>
					</Marker>
				))}
			</MapViewClustering>

			<View className=" absolute top-[650px] left-80">
				<UserLocation onLocationUpdate={handleUserLocationUpdate} />
			</View>
			{selectedParkingSpot && (
				<>
					<TouchableOpacity
						className=" absolute top-0 left-0 right-0 bottom-0"
						onPress={closePopUp}
					/>
					<Animated.View
						className=" absolute bottom-0 w-full"
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
