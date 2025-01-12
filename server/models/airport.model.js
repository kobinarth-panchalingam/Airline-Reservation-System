import { db } from '../configs/db.config.js'

export const AirportModel = {
    create: async data => {
        try {
            const result = await db.query(
                'INSERT INTO airport (airport_code, location_id, airport_name, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
                [
                    data.airport_code,
                    data.location_id,
                    data.airport_name,
                    data.image_url
                ]
            )
            return result.rows[0]
        } catch (error) {
            console.error('Error creating airport:', error)
            throw error
        }
    },

    getAll: async () => {
        try {
            const result = await db.query('SELECT * FROM airport')
            return result.rows
        } catch (error) {
            console.error('Error fetching airports:', error)
            throw error
        }
    },

    getById: async id => {
        try {
            const result = await db.query(
                'SELECT * FROM airport WHERE id = $1',
                [id]
            )
            return result.rows[0]
        } catch (error) {
            console.error('Error fetching airport by id:', error)
            throw error
        }
    },

    getByAirportCode: async code => {
        try {
            const result = await db.query(
                'SELECT * FROM airport WHERE airport_code = $1',
                [code]
            )
            return result.rows[0]
        } catch (error) {
            console.error('Error fetching airport by airport_code:', error)
            throw error
        }
    },

    getByLocationId: async locationId => {
        try {
            const result = await db.query(
                'SELECT * FROM airport WHERE location_id = $1',
                [locationId]
            )
            return result.rows[0]
        } catch (error) {
            console.error('Error fetching airport by location_id:', error)
            throw error
        }
    },

    updateById: async (id, data) => {
        try {
            const result = await db.query(
                'UPDATE airport SET airport_code = $1, location_id = $2, airport_name = $3, image_url = $4 WHERE id = $5 RETURNING *',
                [
                    data.airport_code,
                    data.location_id,
                    data.airport_name,
                    data.image_url,
                    id
                ]
            )
            return result.rows[0]
        } catch (error) {
            console.error('Error updating airport:', error)
            throw error
        }
    },

    deleteById: async id => {
        try {
            const result = await db.query(
                'DELETE FROM airport WHERE id = $1 RETURNING *',
                [id]
            )
            return result.rows[0]
        } catch (error) {
            console.error('Error deleting airport:', error)
            throw error
        }
    }
}
