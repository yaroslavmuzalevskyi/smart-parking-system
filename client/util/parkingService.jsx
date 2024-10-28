import axios from 'axios'

const API_URL = 'http://localhost:8080/info'

export const fetchParkingData = async () => {
	try {
		const response = await axios.get(API_URL)
		const data = response?.data?.data
		const status = response?.data?.status

		if (status !== 'success' || !Array.isArray(data)) {
			console.error('Unexpected response format:', response)
			throw new Error('Unexpected response format')
		}

		return data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
