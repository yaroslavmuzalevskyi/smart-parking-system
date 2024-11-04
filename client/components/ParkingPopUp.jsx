import React from 'react'
import {
	View,
	Image,
	Text,
	TouchableOpacity,
	Linking,
	Alert
} from 'react-native'

const ParkingPopUp = ({ parkingData, userLocation }) => {
	const handleRoutePress = () => {
		if (!userLocation || !parkingData || !parkingData.location) {
			Alert.alert(
				'Data not available',
				'User location or parking data is not available yet.'
			)
			return
		}

		const url = `http://maps.apple.com/?saddr=${userLocation.latitude},${userLocation.longitude}&daddr=${parkingData.location.latitude},${parkingData.location.longitude}`
		Linking.openURL(url)
	}

	console.log(userLocation)

	return (
		<View className=" w-full h-[550px] rounded-3xl bg-white">
			<View>
				<View className=" w-full h-auto flex items-center py-4">
					<Text className="font-bold py-2">Parking: {parkingData.name}</Text>

					<Image source={require('../../assets/images/placeholder.jpg')} />
				</View>
				<View className=" flex justify-center items-center">
					<View className=" w-56 flex flex-row justify-between items-center">
						<Text>Capacity: {parkingData.capacity}</Text>
						<Text>Free: {parkingData.free}</Text>
					</View>
					<Text className=" py-4">
						Lorem Ipsum is simply dummy text of the printing and typesetting
						industry. Lorem Ipsum has been the industry's standard dummy text
						ever since the 1500s, when an unknown printer took a galley of type
						and scrambled it to make a type specimen book.
					</Text>
					<TouchableOpacity
						className=" w-64 h-10 rounded-3xl flex justify-center items-center bg-blue-400"
						onPress={handleRoutePress}
					>
						<Text className="text-white font-bold">Route</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}

export default ParkingPopUp
