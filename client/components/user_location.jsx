import React, { useEffect, useState } from 'react'
import { Image, TouchableOpacity } from 'react-native'
import * as Location from 'expo-location'

const UserLocation = ({ onLocationUpdate }) => {
	const [userLocation, setUserLocation] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		;(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync()
			if (status !== 'granted') {
				console.error('Permission to access location was denied')
				return
			}

			let location = await Location.getCurrentPositionAsync({})
			if (!location) {
				console.error('No location data available')
				return
			}

			setUserLocation(location.coords)
			onLocationUpdate(location.coords)
		})()
	}, [])

	return (
		<TouchableOpacity
			onPress={() => {
				if (userLocation) {
					onLocationUpdate(userLocation)
				} else {
					console.error('User location is not available')
				}
			}}
		>
			<Image
				className=" w-8 h-8 "
				source={require('../../assets/icons/target.png')}
			/>
		</TouchableOpacity>
	)
}

export default UserLocation
