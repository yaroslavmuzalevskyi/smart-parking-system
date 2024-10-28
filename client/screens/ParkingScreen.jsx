import React, { useState, useEffect } from 'react'
import {
	View,
	Text,
	ScrollView,
	ActivityIndicator,
	TouchableOpacity,
	Alert
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import useParkingData from '../hooks/useParkingData'

const ParkingScreen = () => {
	const navigation = useNavigation()
	const { parkingData, loading } = useParkingData()

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
							navigation.navigate('Map', {
								selectedParkingSpot: item
							})
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
