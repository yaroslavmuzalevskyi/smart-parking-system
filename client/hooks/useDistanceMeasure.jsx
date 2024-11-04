import { useEffect, useState } from 'react'
import useParkingData from './useParkingData'
import { Alert } from 'react-native'
import * as Location from 'expo-location' // Import the Location module

const useDistanceMeasure = () => {
	const { parkingData, loading } = useParkingData()
	const [userLocation, setUserLocation] = useState(null)
	const [parkingWithDistance, setParkingWithDistance] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	// Fetch the user's location
	useEffect(() => {
		const fetchLocation = async () => {
			try {
				setIsLoading(true)

				// Fetch the current location
				let location = await Location.getCurrentPositionAsync({
					accuracy: Location.Accuracy.High
				})
				if (!location) {
					Alert.alert('Location Error', 'No location data available')
					setIsLoading(false)
					return
				}

				setUserLocation(location.coords) // Update state with location
			} catch (error) {
				console.error('Error fetching location:', error)
				Alert.alert('Location Error', 'Unable to fetch location')
			} finally {
				setIsLoading(false)
			}
		}

		fetchLocation()
	}, [])

	// Calculate distances when data and location are available
	useEffect(() => {
		if (loading || !userLocation || !parkingData) {
			setIsLoading(true)
			return
		}

		setIsLoading(false)

		const fromLat = userLocation.latitude
		const fromLon = userLocation.longitude

		const toRadians = degree => (degree * Math.PI) / 180

		const calculateDistance = (lat1, lon1, lat2, lon2) => {
			const R = 6371 // Radius of the Earth in kilometers
			const dLat = toRadians(lat2 - lat1)
			const dLon = toRadians(lon2 - lon1)
			const a =
				Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos(toRadians(lat1)) *
					Math.cos(toRadians(lat2)) *
					Math.sin(dLon / 2) *
					Math.sin(dLon / 2)
			const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
			return R * c // Distance in kilometers
		}

		// Calculate distances and update the parking data
		const updatedParkingData = parkingData.map(item => {
			// Adjust property names if necessary
			const itemLat = item.latitude || item.lat || item.coords?.latitude
			const itemLon = item.longitude || item.lon || item.coords?.longitude

			console.log(
				'Calculating distance between:',
				fromLat,
				fromLon,
				itemLat,
				itemLon
			)

			// Check if itemLat and itemLon are valid numbers
			if (
				typeof itemLat !== 'number' ||
				typeof itemLon !== 'number' ||
				isNaN(itemLat) ||
				isNaN(itemLon)
			) {
				console.error(`Invalid coordinates for item ID ${item.id}`)
				return {
					...item,
					distance: NaN
				}
			}

			const distance = calculateDistance(fromLat, fromLon, itemLat, itemLon)

			return {
				...item,
				distance
			}
		})

		// Filter out items with NaN distance
		const validParkingData = updatedParkingData.filter(
			item => !isNaN(item.distance)
		)

		// Sort by distance (nearest first)
		validParkingData.sort((a, b) => a.distance - b.distance)

		setParkingWithDistance(validParkingData)
	}, [loading, userLocation, parkingData])

	return { parkingWithDistance, isLoading }
}

export default useDistanceMeasure
