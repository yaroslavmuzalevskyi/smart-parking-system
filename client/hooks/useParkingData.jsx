import { useState, useEffect } from 'react'
import { fetchParkingData } from './useParkingService'

const useParkingData = () => {
	const [parkingData, setParkingData] = useState([])
	const [loading, setLoading] = useState(true)

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

	return { parkingData, loading }
}

export default useParkingData
