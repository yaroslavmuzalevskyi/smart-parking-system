import React, { useEffect, useState, useRef } from 'react'
import {
	View,
	ActivityIndicator,
	Dimensions,
	StyleSheet,
	Text
} from 'react-native'
import axios from 'axios'
import ClusteredMapView from 'react-native-maps-super-cluster'
import UserLocation from '../components/user_location'
import { PROVIDER_DEFAULT, Marker } from 'react-native-maps'

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
		axios
			.get('http://localhost:8080/info') // Replace with your actual IP or API URL
			.then(
				response => {
					if (
						response.data &&
						response.data.status === 'success' &&
						Array.isArray(response.data.data)
					) {
						const transformedData = response.data.data.map(item => ({
							...item,
							location: {
								latitude: item.lat,
								longitude: item.lon
							}
						}))
						setParkingData(transformedData)
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

	const renderMarker = item => (
		<Marker
			key={item.id}
			coordinate={item.location}
			title={item.name}
			description={`Capacity: ${item.capacity}, Free: ${item.free}`}
		/>
	)

	const renderCluster = (cluster, onPress) => {
		const pointCount = cluster.pointCount
		const coordinate = cluster.coordinate

		return (
			<Marker coordinate={coordinate} onPress={onPress}>
				<View style={styles.clusterContainer}>
					<Text style={styles.clusterText}>{pointCount}</Text>
				</View>
			</Marker>
		)
	}

	if (loading) {
		return (
			<View className="flex-1 justify-center items-center">
				<ActivityIndicator size="large" color="#363636" />
			</View>
		)
	}

	return (
		<View className="flex-1">
			<ClusteredMapView
				provider={PROVIDER_DEFAULT}
				initialRegion={INITIAL_POSITION}
				showsUserLocation={true}
				ref={mapViewRef}
				data={parkingData}
				renderMarker={renderMarker}
				renderCluster={renderCluster}
			/>
			<View className="top-[650px] left-80">
				<UserLocation onLocationUpdate={handleUserLocationUpdate} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	clusterContainer: {
		width: 40,
		height: 40,
		padding: 6,
		borderWidth: 1,
		borderRadius: 20,
		alignItems: 'center',
		borderColor: '#65bc46',
		justifyContent: 'center',
		backgroundColor: '#73c04d'
	},
	clusterText: {
		fontSize: 13,
		color: '#fff',
		fontWeight: '500',
		textAlign: 'center'
	}
})

export default MapScreen
