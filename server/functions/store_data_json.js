const fs = require('fs')

function store_data_json(data) {
	return new Promise((resolve, reject) => {
		const data_to_store = data.parking_names_list.map((name, index) => ({
			name,
			parking_free_places:
				data.parking_free_places_list[index] || 'not available now'
		}))

		const jsonData = JSON.stringify(data_to_store, null, 2)
		fs.writeFile('./info.json', jsonData, 'utf-8', err => {
			if (err) {
				console.error('Error writing to file:', err)
				reject(err)
			} else {
				console.log('File has been written!')
				resolve()
			}
		})
	})
}

module.exports = store_data_json
