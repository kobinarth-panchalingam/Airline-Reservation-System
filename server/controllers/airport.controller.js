import { pool } from '../configs/db.config.js'
import { AirportModel } from '../models/airport.model.js'
import { LocationModel } from '../models/location.model.js'

export const airportController = {
    getAllAirports: async (req, res) => {
        try {
            const airports = await AirportModel.getAll(pool)
            res.json(airports)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    getAirportById: async (req, res) => {
        try {
            const airport = await AirportModel.getById(pool, req.params.id)
            if (!airport) {
                res.status(404).json({ message: 'Airport not found' })
                return
            }
            res.json(airport)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    getAirportsByLocationId: async (req, res) => {
        try {
            const airport = await AirportModel.getAllByLocationId(pool, req.params.locationId)
            if (!airport) {
                res.status(404).json({ message: 'Airport not found' })
                return
            }
            res.json(airport)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    createAirport: async (req, res) => {
        const client = await client.getClient()
        try {
            const { airport_code, airport_name, image_url, country, state, city } = req.body
            client.query('BEGIN')
            // Check if the country exists
            let country_result = await LocationModel.getByNameAndLevel(client, country, 'country')
            let country_id

            if (country_result.rows.length > 0) {
                country_id = country_result[0].id
            } else {
                // Insert country
                country_result = await LocationModel.create(client, country, -1, 'country')
                country_id = country_result[0].id
            }

            let parent_id = country_id
            // Check if the state exists
            if (state) {
                let state_result = await LocationModel.getByNameAndLevel(client, state, 'state')
                let state_id

                if (state_result.length > 0) {
                    state_id = state_result[0].id
                } else {
                    state_result = await LocationModel.create(client, state, country_id, 'state')
                    state_id = state_result[0].id
                }
                parent_id = state_id
            }
            // Check if the city exists
            let city_result = await LocationModel.getByNameAndLevel(client, city, 'city')
            let city_id
            if (city_result.length > 0) {
                city_id = city_result[0].id
            } else {
                city_result = await LocationModel.create(client, city, parent_id, 'city')
            }

            // Insert Airport
            const airport_data = {
                airport_code,
                airport_name,
                city_id,
                image_url
            }
            const airport = await AirportModel.create(client, airport_data)
            client.query('COMMIT')
            res.status(201).json(airport)
        } catch (error) {
            client.query('ROLLBACK')
            res.status(500).json({ message: error.message })
        } finally {
            client.release()
        }
    },

    updateAirportByCode: async (req, res) => {
        /**
         * 1. Get the airport by code
         * 2. Get the city, state, and country of the airport
         * 3. Check if the country, state, and city are the same as the request
         * 4. If not, update the location table
         * 5. Update the airport table
         * 6. Return the updated airport
         */
        const client = client.getClient()
        try {
            client.query('BEGIN')
            const { airport_code, airport_name, country, state, city, image_url } = req.body
            const update_data = {}
            const airport_result = await AirportModel.getByCode(client, airport_code)
            let city_id = airport_result[0].location_id
            let city_result = await LocationModel.getById(client, city_id)
            let state_result = await LocationModel.getById(client, city_result.parent_id)
            let country_result = await LocationModel.getById(client, state_result.parent_id)
            const is_country_same = country === country_result.location_name
            const is_state_same = state === state_result.location_name
            const is_city_same = city === city_result.location_name

            let state_parent_id = country_result.id
            let city_parent_id = state_result.id
            if (!is_country_same) {
                const updated_country = await LocationModel.getByNameAndLevel(client, country, 'country')
                if (updated_country.length > 0) {
                    state_parent_id = updated_country[0].id
                } else {
                    country_result = await LocationModel.create(client, country, -1, 'country')
                    state_parent_id = country_result[0].id
                }
                state_result = await LocationModel.update(client, state, state_parent_id, 'state', state_result.id)
            }

            if (!is_state_same) {
                const updated_state = await LocationModel.getByNameAndLevel(client, state, 'state')
                city_parent_id
                if (updated_state.length > 0) {
                    city_parent_id = updated_state[0].id
                } else {
                    state_result = await LocationModel.create(client, state, state_parent_id, 'state')
                    city_parent_id = state_result[0].id
                }
                city_result = await LocationModel.update(client, city, city_parent_id, 'city', city_result.id)
            }

            if (!is_city_same) {
                const updated_city = await LocationModel.getByNameAndLevel(client, city, 'city')
                if (updated_city.length > 0) {
                    city_id = updated_city[0].id
                } else {
                    city_result = await LocationModel.create(client, city, city_parent_id, 'city')
                    city_id = city_result[0].id
                }
            }
            update_data.airport_code = airport_code
            update_data.airport_name = airport_name
            update_data.image_url = image_url
            update_data.location_id = city_id
            const airport = await AirportModel.updateByCode(client, update_data)
            res.json(airport)
            client.query('COMMIT')
        } catch (error) {
            client.query('ROLLBACK')
            res.status(500).json({ message: error.message })
        } finally {
            client.release()
        }
    },

    deleteAirport: async (req, res) => {
        try {
            const airport = await AirportModel.deleteById(pool, req.params.id)
            if (!airport) {
                res.status(404).json({ message: 'Airport not found' })
                return
            }
            res.json(airport)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}
