import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import axios from 'axios'

const app = express()
app.use(express.json())

const PORT = 8082

const genAI = new GoogleGenerativeAI('AIzaSyBRxSzg0aV3pDYCPL9kMlaU0tfw9LFmLxg')
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

let parkingData = null

async function fetchParkingData() {
	try {
		const response = await axios.get('http://localhost:8080/info')
		parkingData = response.data.data
		console.log('Data updated')
	} catch (error) {
		console.error('Error fetching parking data:', error)
	}
}

fetchParkingData()

setInterval(fetchParkingData, 60000)

app.post('/chat', async (req, res) => {
	try {
		const { prompt, userLocation } = req.body

		if (!prompt) {
			return res.status(400).json({ message: 'Prompt is required' })
		}

		if (!userLocation) {
			return res.status(400).json({ message: 'userLocation is required' })
		}

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

		// Calculate distances to each parking spot
		const parkingDataWithDistance = parkingData.map(item => {
			const toLat = item.lat
			const toLon = item.lon

			const distance = calculateDistance(fromLat, fromLon, toLat, toLon)

			return {
				...item,
				distance
			}
		})

		console.log(parkingDataWithDistance)

		const parkingSpotsString = parkingDataWithDistance
			.map(item => {
				return `Name: ${item.name}, Distance: ${item.distance.toFixed(
					2
				)} km, Free spots: ${item.free}`
			})
			.join('\n')

		const modifiedPrompt = `Write a short answer (max 150 words). Based on the user's location, the nearest parking spots are:\n${parkingSpotsString}\n${prompt}`
		const result = await model.generateContent(modifiedPrompt)

		res.status(200).json({ response: result.response.text() })
	} catch (error) {
		console.error('Error generating AI response:', error)
		res.status(500).json({ error: 'Internal server error.' })
	}
})

app.listen(PORT, () => {
	console.log(`Server launched on port ${PORT}`)
})
