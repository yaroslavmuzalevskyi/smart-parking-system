import React, { useEffect, useState, useRef } from 'react'
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps'
import axios from 'axios'
import UserLocation from '../components/user_location'

const { width, height } = Dimensions.get('window')

const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.02
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const INITIAL_POSITION = {
	latitude: 49.611622,
	longitude: 6.131935,
	latitudeDelta: LATITUDE_DELTA,
	longitudeDelta: LONGITUDE_DELTA
}

const MapScreen = ({ navigation }) => {
	const [parkingData, setParkingData] = useState([])
	const [parkingCoordinates, setParkingCoordinate] = useState(null)
	const [userLocation, setUserLocation] = useState(null)
	const mapViewRef = useRef(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		axios
			.get('http://localhost:8080/info') // Replace with your actual IP or API URL
			.then(
				response => {
					if (
						response.data &&
						response.data.status === 'success' &&
						response.data.data
					) {
						setParkingData(response.data.data)
					} else {
						console.error('Unexpected response format:', response)
					}
					setLoading(false)
				},
				error => {
					console.error('Error fetching data:', error)
					setLoading(false)
				}
			)
	}, [])

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

	const handleParkingLocationUpdate = parking => {
		if (
			!parking ||
			typeof parking.lat === 'undefined' ||
			typeof parking.lon === 'undefined'
		) {
			console.error('Parking data is undefined or missing properties:', parking)
			return
		}

		setParkingCoordinate(parking)
		if (mapViewRef.current) {
			mapViewRef.current.animateToRegion(
				{
					latitude: parking.lat,
					longitude: parking.lon,
					latitudeDelta: 0.005,
					longitudeDelta: 0.005
				},
				1000
			)
		}
	}

	if (loading) {
		return (
			<View className=" flex-1 justify-center items-center ">
				<ActivityIndicator size="large" color="#363636" />
			</View>
		)
	}

	return (
		<View className=" flex-1 ">
			<MapView
				style={StyleSheet.absoluteFillObject}
				provider={PROVIDER_DEFAULT}
				initialRegion={INITIAL_POSITION}
				showsUserLocation={true}
				ref={mapViewRef}
			>
				{parkingData.map((parking, index) => (
					<Marker
						key={index}
						coordinate={{ latitude: parking.lat, longitude: parking.lon }}
						title={parking.name}
						description={`Capacity: ${parking.capacity}, Free: ${parking.free}`}
					/>
				))}
			</MapView>
			<View className=" top-[650px] left-80 ">
				<UserLocation onLocationUpdate={handleUserLocationUpdate} />
			</View>
		</View>
	)
}

export default MapScreen
