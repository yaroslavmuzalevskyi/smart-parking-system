const fetch_database = () => {
	return new Promise((resolve, reject) => {
		db.query('SELECT * FROM parking', (error, result) => {
			if (error) {
				console.error('Database query error:', error)
				return reject(error)
			}

			// Transform the result to a more usable format
			const output_array = result.map(parkingObj => ({
				name: parkingObj.parking_name,
				capacity: parkingObj.capacity,
				free: parkingObj.free_places,
				coordinate_lat: parkingObj.latitude,
				coordinate_lon: parkingObj.longitude
			}))

			resolve(output_array)
		})
	})
}

module.exports = fetch_database
