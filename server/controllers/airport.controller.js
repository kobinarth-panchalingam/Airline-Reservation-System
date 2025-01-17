import { db } from '../configs/db.config.js'
import { AirportModel } from '../models/airport.model.js'
import { LocationModel } from '../models/location.model.js'

export const airportController = {
    getAllAirports: async (req, res) => {
        try {
            const airports = await AirportModel.getAll(db)
            res.json(airports)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    getAirportById: async (req, res) => {
        try {
            const airport = await AirportModel.getById(db, req.params.id)
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
            const airport = await AirportModel.getAllByLocationId(
                db,
                req.params.locationId
            )
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
        const client = await db.getClient()
        try {
            const {
                airport_code,
                airport_name,
                image_url,
                country,
                state,
                city
            } = req.body
            client.query('BEGIN')
            // Check if the country exists
            let country_result = await LocationModel.getByNameAndLevel(
                client,
                country,
                'country'
            )
            let country_id

            if (country_result.rows.length > 0) {
                country_id = country_result[0].id
            } else {
                // Insert country
                country_result = await LocationModel.create(
                    client,
                    country,
                    -1,
                    'country'
                )
                country_id = country_result[0].id
            }

            let parent_id = country_id
            // Check if the state exists
            if (state) {
                let state_result = await LocationModel.getByNameAndLevel(
                    client,
                    state,
                    'state'
                )
                let state_id

                if (state_result.length > 0) {
                    state_id = state_result[0].id
                } else {
                    state_result = await LocationModel.create(
                        client,
                        state,
                        country_id,
                        'state'
                    )
                    state_id = state_result[0].id
                }
                parent_id = state_id
            }
            // Check if the city exists
            let city_result = await LocationModel.getByNameAndLevel(
                client,
                city,
                'city'
            )
            let city_id
            if (city_result.length > 0) {
                city_id = city_result[0].id
            } else {
                city_result = await LocationModel.create(
                    client,
                    city,
                    parent_id,
                    'city'
                )
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

    updateAirport: async (req, res) => {
        try {
            const airport = await AirportModel.updateById(
                req.params.id,
                req.body
            )
            if (!airport) {
                res.status(404).json({ message: 'Airport not found' })
                return
            }
            res.json(airport)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    deleteAirport: async (req, res) => {
        try {
            const airport = await AirportModel.deleteById(db, req.params.id)
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
