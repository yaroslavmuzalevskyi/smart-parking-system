import fs from 'fs'

function read_data_json() {
	return new Promise((resolve, reject) => {
		fs.readFile('./info.json', 'utf-8', (err, data) => {
			if (err) {
				console.error('Error reading file:', err)
				reject(err)
			} else {
				resolve(JSON.parse(data))
			}
		})
	})
}

export default read_data_json
