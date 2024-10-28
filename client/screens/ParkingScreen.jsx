import React, { useState, useEffect } from 'react'
import {
	View,
	Text,
	ScrollView,
	ActivityIndicator,
	StyleSheet,
	TouchableOpacity
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { fetchParkingData } from '../util/parkingService'

const ParkingScreen = () => {
	const [parkingData, setParkingData] = useState([])
	const [loading, setLoading] = useState(true)
	const navigation = useNavigation()

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

	if (loading) {
		return (
			<View className=" flex-1 p-4">
				<ActivityIndicator size="large" color="#363636" />
			</View>
		)
	}

	return (
		<View className=" flex-1 p-4">
			<ScrollView>
				{parkingData.map(item => (
					<TouchableOpacity
						key={item.id}
						onPress={() =>
							navigation.navigate('Map', { selectedParking: item })
						}
					>
						<View className=" py-3 border-b-2 border-white">
							<Text className=" text-base font-bold">Name: {item.name}</Text>
							<Text className=" text-xs text-gray-400">
								Capacity: {item.capacity}, Free: {item.free}
							</Text>
						</View>
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	)
}

export default ParkingScreen
