const mysql = require('mysql')
const dotenv = require('dotenv')
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const moment = require('moment')
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
dotenv.config()

// API endpoint to get parking info
app.get('/info', async (req, res) => {
	try {
		const parkings = await fetch_database()
		res.status(200).json({
			status: 'success',
			data: parkings
		})
	} catch (error) {
		res.status(500).json({
			status: 'error',
			message: 'Failed to fetch parking data'
		})
	}
})

var local_name = process.env.LOCALNAME
var secure_key = process.env.PASSWORD

// var db = mysql.createConnection({
//   host: "localhost",
//   user: local_name,
//   password: secure_key,
//   database: "parking-database",
// });

// MySQL database connection pool
const db = mysql.createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: local_name,
	password: secure_key,
	database: 'parking_database',
	port: 3306
})

// Function to fetch parking data from the database
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

const url =
	'https://www.luxembourg-city.com/en/plan-your-stay/traveller-information/car-parks'

// Function to scrape parking data from the web
async function get_data() {
	try {
		const response = await axios.get(url, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
			}
		})

		const html = response.data
		const $ = cheerio.load(html)

		const parkingTable = $('table.table-parking')
		const rows = parkingTable.find('tr')

		const parkingNamesList = []
		const parkingCapacityList = []
		const parkingFreePlacesList = []

		rows.each((index, element) => {
			const cells = $(element).find('td')

			if (cells.length >= 3) {
				const parkingName = $(cells[0]).text().trim()
				const parkingCapacity = $(cells[1]).text().trim()
				const parkingFreePlaces = $(cells[2]).text().trim()

				parkingNamesList.push(parkingName)
				parkingCapacityList.push(parkingCapacity)
				parkingFreePlacesList.push(parkingFreePlaces)
			}
		})

		return {
			parking_names_list: parkingNamesList,
			parking_capacity_list: parkingCapacityList,
			parking_free_places_list: parkingFreePlacesList
		}
	} catch (error) {
		console.error(`Error fetching data from web: ${error.message}`)
		return null
	}
}

// Function to store data into JSON file
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

// Function to read data from JSON file
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

// Function to clear and reset the database
function clear_database() {
	const dropTableQuery = 'DROP TABLE IF EXISTS parking'

	db.query(dropTableQuery, err => {
		if (err) {
			console.error('Error dropping the table:', err)
			return
		}
		console.log('Table dropped successfully')

		const createTableQuery = `
      CREATE TABLE parking (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        parking_name VARCHAR(255) NOT NULL,
        capacity VARCHAR(255) NOT NULL,
        free_places VARCHAR(255) NOT NULL,
        date_time DATETIME NOT NULL,
        latitude DECIMAL(9,6) NOT NULL,
        longitude DECIMAL(9,6) NOT NULL
      );
    `

		db.query(createTableQuery, err => {
			if (err) {
				console.error('Error creating the table:', err)
			}
			console.log('Table created successfully')
		})
	})
}

const coordinates_array = [
	{
		name: 'Théâtre',
		latitude: 49.61302848278971,
		longitude: 6.1308853817122735
	},
	{
		name: 'Saint-Esprit',
		latitude: 49.608402749022,
		longitude: 6.1326583224233
	},
	{
		name: 'Knuedler',
		latitude: 49.610119002318584,
		longitude: 6.130073006950971
	},
	{
		name: 'Monterey',
		latitude: 49.60992423456283,
		longitude: 6.121693040480422
	},
	{
		name: 'Rond Point Schuman',
		latitude: 49.618285467681694,
		longitude: 6.125035003264612
	},
	{
		name: 'Martyrs',
		latitude: 49.60479743639643,
		longitude: 6.128895043834578
	},
	{
		name: 'Rocade',
		latitude: 49.60304199858991,
		longitude: 6.136498950870434
	},
	{
		name: 'Fort Wedell',
		latitude: 49.59964950137812,
		longitude: 6.129414016173162
	},
	{
		name: 'Fort Neipperg',
		latitude: 49.60224054490655,
		longitude: 6.134857203026486
	},
	{
		name: 'Luxembourg Sud B',
		latitude: 49.580123,
		longitude: 6.128926
	},
	{
		name: 'Auchan',
		latitude: 49.63233,
		longitude: 6.17133
	},
	{
		name: "Place de l'Europe",
		latitude: 49.61983,
		longitude: 6.144
	},
	{
		name: 'Trois Glands',
		latitude: 49.61703632251232,
		longitude: 6.1423352276626915
	},
	{
		name: 'Erasme',
		latitude: 49.62239822493481,
		longitude: 6.151197840981207
	},
	{
		name: 'Coque',
		latitude: 49.62433,
		longitude: 6.15116
	},
	{
		name: 'Gare',
		latitude: 49.5980379445745,
		longitude: 6.132796596251777
	},
	{
		name: 'Adenauer',
		latitude: 49.62998605479285,
		longitude: 6.1572497168841895
	},
	{
		name: 'Stade',
		latitude: 49.614073216155674,
		longitude: 6.1084891146987355
	},
	{
		name: 'Glacis',
		latitude: 49.61596193019561,
		longitude: 6.122425849392858
	},
	{
		name: 'LuxExpo',
		latitude: 49.63533,
		longitude: 6.17467
	},
	{
		name: 'Gernsback',
		latitude: 49.63616569484756,
		longitude: 6.174443514619095
	},
	{
		name: 'Luxembourg Sud A',
		latitude: 49.57811789714599,
		longitude: 6.129000549986007
	},
	{
		name: 'Kockelscheuer',
		latitude: 49.565,
		longitude: 6.10883
	},
	{
		name: 'Bouillon',
		latitude: 49.59931555269169,
		longitude: 6.109138472337518
	},
	{
		name: 'Beggen',
		latitude: 49.65019062492493,
		longitude: 6.12918077238607
	},
	{
		name: 'Brasserie',
		latitude: 49.61211924766946,
		longitude: 6.142371814597461
	},
	{
		name: 'Nobilis',
		latitude: 49.602454,
		longitude: 6.134845
	},
	{
		name: 'Royal-Hamilius',
		latitude: 49.61039139979187,
		longitude: 6.124614613467932
	},
	{
		name: 'Stade de Luxembourg',
		latitude: 49.576956397567294,
		longitude: 6.10957375665023
	},
	{
		name: 'Campus Cents',
		latitude: 49.61642280499001,
		longitude: 6.1644745055065915
	}
]

// Function to insert data into the database
function insert_data_database(parking_name, capacity, free_places) {
	const date_time = moment().format('YYYY-MM-DD HH:mm:ss')

	const coordinates = coordinates_array.find(o => o.name === parking_name)

	if (!coordinates) {
		console.error(`Coordinates not found for parking: ${parking_name}`)
		return
	}

	const insertQuery =
		'INSERT INTO parking (parking_name, capacity, free_places, date_time, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)'

	db.query(
		insertQuery,
		[
			parking_name,
			capacity,
			free_places,
			date_time,
			coordinates.latitude,
			coordinates.longitude
		],
		err => {
			if (err) {
				console.error('Error inserting data:', err)
			} else {
				console.log(`Data inserted successfully for ${parking_name}`)
			}
		}
	)
}

// Function to update data in the database
function update_data_database(name, free_places) {
	const date_time = moment().format('YYYY-MM-DD HH:mm:ss')

	const updateQuery =
		'UPDATE parking SET free_places = ?, date_time = ? WHERE parking_name = ?'

	db.query(updateQuery, [free_places, date_time, name], err => {
		if (err) {
			console.error('Error updating data:', err)
		}
	})
}

// Main function to handle data fetching and updating
async function main() {
	clear_database()

	const web_parking_data = await get_data()
	if (!web_parking_data) {
		console.error('Failed to fetch initial parking data.')
		return
	}

	await store_data_json(web_parking_data)

	for (let i = 0; i < web_parking_data.parking_names_list.length; i++) {
		const parking_name = web_parking_data.parking_names_list[i]
		const parking_capacity = web_parking_data.parking_capacity_list[i]
		const parking_free_places = web_parking_data.parking_free_places_list[i]

		insert_data_database(parking_name, parking_capacity, parking_free_places)
	}

	// Function to periodically check for updates
	const checkForUpdates = async () => {
		console.log('Checking for updates...')

		const updated_data = await get_data()
		if (!updated_data) {
			console.error('Failed to fetch updated parking data.')
			setTimeout(checkForUpdates, 10000)
			return
		}

		const json_data = await read_data_json()

		for (let i = 0; i < updated_data.parking_names_list.length; i++) {
			const name = updated_data.parking_names_list[i]
			let free_places_from_new_data = updated_data.parking_free_places_list[i]

			const parking_info_from_json = json_data.find(
				parking => parking.name === name
			)

			if (!free_places_from_new_data) {
				free_places_from_new_data = parking_info_from_json.free_places
			}

			if (parking_info_from_json.free_places !== free_places_from_new_data) {
				update_data_database(name, free_places_from_new_data)
			}
		}

		setTimeout(checkForUpdates, 15000)
	}

	checkForUpdates()
}

app.listen(8080, '0.0.0.0', () => {
	main()
	console.log('API READY')
})
