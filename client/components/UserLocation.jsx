import React, { useEffect, useState, useCallback } from 'react'
import { Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import * as Location from 'expo-location'

const UserLocation = ({ onLocationUpdate }) => {
	const [loading, setLoading] = useState(false)
	const [userLocation, setUserLocation] = useState(null) // Define state for user location

	const fetchLocation = useCallback(async () => {
		try {
			setLoading(true)

			// Request permission to access location
			let { status } = await Location.requestForegroundPermissionsAsync()
			if (status !== 'granted') {
				Alert.alert(
					'Permission Denied',
					'Permission to access location was denied'
				)
				setLoading(false)
				return
			}

			// Fetch the current location
			let location = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.High
			})
			if (!location) {
				Alert.alert('Location Error', 'No location data available')
				setLoading(false)
				return
			}

			setUserLocation(location.coords) // Update state with location
			onLocationUpdate(location.coords) // Pass location to parent component
		} catch (error) {
			console.error('Error fetching location:', error)
			Alert.alert('Location Error', 'Unable to fetch location')
		} finally {
			setLoading(false) // Ensure loading is stopped even if an error occurs
		}
	}, [onLocationUpdate])

	return (
		<TouchableOpacity onPress={fetchLocation} disabled={loading}>
			{loading ? (
				<ActivityIndicator color="#fff" />
			) : (
				<Image
					className=" w-8 h-8"
					source={require('../../assets/icons/target.png')}
				/>
			)}
		</TouchableOpacity>
	)
}

export default UserLocation
