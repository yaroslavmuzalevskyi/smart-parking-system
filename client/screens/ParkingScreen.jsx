import React from 'react'
import {
	View,
	Text,
	ScrollView,
	ActivityIndicator,
	TouchableOpacity
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import useDistanceMeasure from '../hooks/useDistanceMeasure'

const ParkingScreen = () => {
	const navigation = useNavigation()
	const { parkingWithDistance, isLoading } = useDistanceMeasure()

	if (isLoading) {
		return (
			<View className="flex-1 p-4 justify-center items-center">
				<ActivityIndicator size="large" color="#363636" />
			</View>
		)
	}

	return (
		<View className="flex-1 p-4">
			<ScrollView>
				{parkingWithDistance.map(item => (
					<TouchableOpacity
						key={item.id || item.name}
						onPress={() =>
							navigation.navigate('Map', {
								selectedParkingSpot: item
							})
						}
					>
						<View className="py-3 border-b-2 border-white">
							<Text className="text-base font-bold">Name: {item.name}</Text>
							<Text className="text-xs text-gray-400">
								Capacity: {item.capacity}, Free: {item.free}
							</Text>
							<Text className="text-xs text-gray-400">
								Distance: {item.distance.toFixed(2)} km
							</Text>
						</View>
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	)
}

export default ParkingScreen
