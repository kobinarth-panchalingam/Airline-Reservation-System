import { db } from '../configs/db.config'

export const LocationModel = {
    create: async data => {
        try {
            const result = await db.query(
                'INSERT INTO location (location_name, country, city, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
                [data.location_name, data.country, data.city, data.image_url]
            )
            return result.rows[0]
        } catch (error) {
            console.error('Error creating location:', error)
            throw error
        }
    },

    getAll: async () => {
        try {
            const result = await db.query('SELECT * FROM location')
            return result.rows
        } catch (error) {
            console.error('Error fetching locations:', error)
            throw error
        }
    },

    getById: async id => {
        try {
            const result = await db.query(
                'SELECT * FROM location WHERE id = $1',
                [id]
            )
            return result.rows[0]
        } catch (error) {
            console.error('Error fetching location by id:', error)
            throw error
        }
    },

    update: async (id, data) => {
        try {
            const result = await db.query(
                'UPDATE location SET location_name = $1, country = $2, city = $3, image_url = $4 WHERE id = $5 RETURNING *',
                [
                    data.location_name,
                    data.country,
                    data.city,
                    data.image_url,
                    id
                ]
            )
            return result.rows[0]
        } catch (error) {
            console.error('Error updating location:', error)
            throw error
        }
    },

    delete: async id => {
        try {
            const result = await db.query(
                'DELETE FROM location WHERE id = $1 RETURNING *',
                [id]
            )
            return result.rows[0]
        } catch (error) {
            console.error('Error deleting location:', error)
            throw error
        }
    }
}
