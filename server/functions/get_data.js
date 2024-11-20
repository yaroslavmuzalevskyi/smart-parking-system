import axios from 'axios'
import * as cheerio from 'cheerio'

async function get_data(url) {
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

export default get_data
