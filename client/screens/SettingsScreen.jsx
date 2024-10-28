import React, { useState } from 'react'
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native'

const SettingsScreen = () => {
	const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false)
	const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true)

	return (
		<ScrollView className=" p-4 pb-8">
			<View className=" flex-row justify-between items-center my-3 px-2">
				<Text className=" text-xl">Dark Mode</Text>
				<Switch
					value={isDarkModeEnabled}
					onValueChange={value => setIsDarkModeEnabled(value)}
				/>
			</View>

			<View className=" flex-row justify-between items-center my-3 px-2">
				<Text className=" text-xl">Notifications</Text>
				<Switch
					value={isNotificationsEnabled}
					onValueChange={value => setIsNotificationsEnabled(value)}
				/>
			</View>
		</ScrollView>
	)
}

export default SettingsScreen
