function clear_database(parkingModule) {
	parkingModule.collection.drop(err => {
		if (err && err.code !== 26) {
			// Code 26 = NamespaceNotFound, which means the collection doesn't exist
			console.error('Error dropping the collection:', err)
			return
		}
		console.log('Collection dropped successfully')

		// Optionally, recreate the collection or ensure indexes
		parkingModule
			.init()
			.then(() => {
				console.log('Collection and indexes initialized successfully')
			})
			.catch(initErr => {
				console.error('Error initializing collection:', initErr)
			})
	})
}

export default clear_database
