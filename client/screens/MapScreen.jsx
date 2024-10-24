import React, { useEffect, useState, useRef } from 'react'
import {
	View,
	ActivityIndicator,
	Dimensions,
	StyleSheet,
	Text,
	Image
} from 'react-native'
import axios from 'axios'
import MapView, { Marker } from 'react-native-maps' // Import MapView from react-native-maps
import MapViewClustering from 'react-native-map-clustering' // Import clustering from react-native-map-clustering
import UserLocation from '../components/UserLocation'

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
	const [userLocation, setUserLocation] = useState(null)
	const mapViewRef = useRef(null)
	const [loading, setLoading] = useState(true)

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

		axios
			.get('http://localhost:8080/info') // Replace with your actual IP or API URL
			.then(
				response => {
					const data = response?.data?.data
					const status = response?.data?.status

					if (status !== 'success' || !Array.isArray(data)) {
						console.error('Unexpected response format:', response)
						setLoading(false)
						return
					}

					const transformedData = transformData(data)
					setParkingData(transformedData)
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

	const renderMarker = item => (
		<Marker
			key={item.id || Math.random()}
			coordinate={item.location}
			title={item.name}
			description={`Capacity: ${item.capacity}, Free: ${item.free}`}
		>
			<Image
				source={require('../../assets/icons/parking.png')}
				style={styles.markerImage} // Updated from className to style
			/>
		</Marker>
	)

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#363636" />
			</View>
		)
	}

	return (
		<View style={styles.container}>
			<MapViewClustering
				style={styles.map}
				region={INITIAL_POSITION}
				showsUserLocation={true}
				ref={mapViewRef}
			>
				{parkingData.map(item => renderMarker(item))}
			</MapViewClustering>

			<View>
				<UserLocation onLocationUpdate={handleUserLocationUpdate} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	map: {
		...StyleSheet.absoluteFillObject
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	markerImage: {
		width: 32,
		height: 32,
		resizeMode: 'contain'
	}
})

export default MapScreen
