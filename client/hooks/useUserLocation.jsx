import { useState } from 'react'

const useUserLocation = () => {
	const [userLocation, setUserLocation] = useState(null)

	const handleUserLocationUpdate = location => {
		if (!location) {
			console.log('User location is not available.')
			return
		}
		setUserLocation(location)
	}

	return { userLocation, handleUserLocationUpdate }
}

export default useUserLocation
