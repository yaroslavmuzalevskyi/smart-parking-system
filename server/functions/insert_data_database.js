async function insert_data_database(
	parking_name,
	capacity,
	free_places,
	coordinates_array,
	parkingModule
) {
	// Get the current date and time
	const date_time = new Date()

	// Find coordinates for the given parking_name
	const coordinates = coordinates_array.find(o => o.name === parking_name)

	if (!coordinates) {
		console.error(`Coordinates not found for parking: ${parking_name}`)
		return
	}

	// Convert capacity and free_places to numbers if they're not already
	const capacityNum = Number(capacity)
	const freePlacesNum = Number(free_places)

	// Create a new parking document
	const newParking = new parkingModule({
		name: parking_name,
		capacity: capacityNum,
		free: freePlacesNum,
		dateTime: date_time,
		lat: coordinates.latitude,
		lon: coordinates.longitude
	})

	try {
		// Save the document to the database
		await newParking.save()
		console.log(`Data inserted successfully for ${parking_name}`)
	} catch (err) {
		console.error('Error inserting data:', err)
	}
}

module.exports = insert_data_database
