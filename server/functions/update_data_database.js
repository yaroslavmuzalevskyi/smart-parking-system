async function update_data_database(name, free_places, parkingModule) {
	// Get the current date and time
	const date_time = new Date()

	// Convert free_places to a number if it's not already
	const freePlacesNum = Number(free_places)

	try {
		// Update the document in the database
		const result = await parkingModule.updateOne(
			{ name: name }, // Filter: Find the document with the matching name
			{
				$set: {
					free: freePlacesNum,
					dateTime: date_time
				}
			}
		)

		if (result.matchedCount > 0) {
			console.log(`Data updated successfully for ${name}`)
		} else {
			console.log(`No matching document found for ${name}`)
		}
	} catch (err) {
		console.error('Error updating data:', err)
	}
}

export default update_data_database
