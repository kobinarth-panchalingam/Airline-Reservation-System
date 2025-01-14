import { db } from '../configs/db.config.js'

export const FlightFare = {
    getAll: async () => {
        try {
            const result = await db.query('SELECT * FROM flight_fare')
            return result.rows
        } catch (error) {
            console.error('Error fetching flight fares:', error)
            throw error
        }
    },
    getById: async id => {
        try {
            const result = await db.query(
                'SELECT * FROM flight_fare WHERE id = $1',
                [id]
            )
            return result.rows[0]
        } catch (error) {
            console.error('Error fetching flight fare by id:', error)
            throw error
        }
    },

    create: async data => {
        try {
            const result = await db.query(
                'INSERT INTO flight_fare (route_id, traveler_class_id, price) VALUES ($1, $2, $3) RETURNING *',
                [data.route_id, data.traveler_class_id, data.price]
            )
            return result.rows[0]
        } catch (error) {
            console.error('Error creating flight fare:', error)
            throw error
        }
    },

    updateById: async (id, data) => {
        try {
            const result = await db.query(
                'UPDATE flight_fare SET route_id = $1, traveler_class_id = $2, price = $3 WHERE id = $4 RETURNING *',

                [data.route_id, data.traveler_class_id, data.price, id]
            )
            return result.rows[0]
        } catch (error) {
            console.error('Error updating flight fare:', error)
            throw error
        }
    },
    deleteById: async id => {
        try {
            const result = await db.query(
                'DELETE FROM flight_fare WHERE id = $1 RETURNING *',
                [id]
            )
            return result.rows[0]
        } catch (error) {
            console.error('Error deleting flight fare:', error)
            throw error
        }
    }
}
