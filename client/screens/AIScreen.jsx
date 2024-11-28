// Import statements
import React, { useState } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	ActivityIndicator
} from 'react-native'
import useDistanceMeasure from '../hooks/useDistanceMeasure'
import { useNavigation } from '@react-navigation/native'

const AIScreen = () => {
	const [input, setInput] = useState('')
	const [output, setOutput] = useState('')
	const [loading, setLoading] = useState(false)
	const navigation = useNavigation()
	const { parkingWithDistance, isLoading, userLocation } = useDistanceMeasure()

	const handleInput = async () => {
		if (!input) {
			alert('Please ask your question')
			return
		}

		if (isLoading) {
			alert('Fetching your location. Please wait a moment.')
			return
		}

		if (!userLocation) {
			alert('Unable to retrieve your location. Please try again.')
			return
		}

		setLoading(true)

		try {
			const response = await fetch('http://localhost:8082/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ prompt: input, userLocation })
			})

			const data = await response.json()

			if (response.ok) {
				setOutput(data.response)
			} else {
				alert(data.error || 'An error occurred.')
			}
		} catch (error) {
			console.error('Error:', error)
			alert('Failed to connect to the server.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<View className=" h-full flex justify-between p-6 ">
			<View>
				<View>
					<TextInput
						className=" border-1 my-5 p-3"
						editable
						multiline
						numberOfLines={4}
						placeholder="Type your message here"
						onChangeText={text => setInput(text)}
						value={input}
					/>
				</View>
				<TouchableOpacity
					onPress={handleInput}
					className="bg-zinc-500 p-3 rounded-xl items-center"
					disabled={loading}
				>
					{loading ? (
						<ActivityIndicator color="#FFFFFF" />
					) : (
						<Text style={{ color: '#FFFFFF' }}>Send</Text>
					)}
				</TouchableOpacity>
				<View className=" mt-5">
					<Text className=" text-lg">{output}</Text>
				</View>
			</View>
			<View className=" w-full justify-center items-center">
				<TouchableOpacity
					className=" w-full h-10 rounded-xl justify-center items-center bg-zinc-500"
					onPress={() => navigation.navigate('Parkings')}
				>
					<Text className="text-white">Navigate</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default AIScreen
