import React, { useEffect, useState, useRef } from 'react'
import {
	View,
	ActivityIndicator,
	Dimensions,
	StyleSheet,
	Image
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
	const mapViewRef = useRef(null)
	const [loading, setLoading] = useState(true)

	const route = useRoute()
	const { selectedParking } = route.params || {}

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

	// Focus on selected parking when parameter changes
	useEffect(() => {
		if (selectedParking && mapViewRef.current) {
			mapViewRef.current.animateToRegion(
				{
					latitude: selectedParking.location.latitude,
					longitude: selectedParking.location.longitude,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01
				},
				1000
			)
		}
	}, [selectedParking])

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
						title={item.name}
						description={`Capacity: ${item.capacity}, Free: ${item.free}`}
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

			<View className=" top-[250px]">
				<ParkingPopUp></ParkingPopUp>
			</View>
		</View>
	)
}

export default MapScreen
