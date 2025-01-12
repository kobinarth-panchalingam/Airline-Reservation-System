import { db } from '../configs/db.config.js'

export const FlightModel = {
    create: async data => {
        try {
            const result = await db.query(
                'INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [
                    data.airplane_id,
                    data.route_id,
                    data.departure_time,
                    data.arrival_time,
                    data.flight_status
                ]
            )
            return result.rows[0]
        } catch (error) {
            console.error('Error creating flight:', error)
            throw error
        }
    },

    getAll: async () => {
        try {
            const result = await db.query('SELECT * FROM flight')
            return result.rows
        } catch (error) {
            console.error('Error fetching flights:', error)
            throw error
        }
    },

    getById: async id => {
        try {
            const result = await db.query(
                'SELECT * FROM flight WHERE id = $1',
                [id]
            )
            return result.rows[0]
        } catch (error) {
            console.error('Error fetching flight by id:', error)
            throw error
        }
    },

    updateById: async (id, data) => {
        try {
            const result = await db.query(
                'UPDATE flight SET airplane_id = $1, route_id = $2, departure_time = $3, arrival_time = $4, flight_status = $5 WHERE id = $6 RETURNING *',
                [
                    data.airplane_id,
                    data.route_id,
                    data.departure_time,
                    data.arrival_time,
                    data.flight_status,
                    id
                ]
            )
            return result.rows[0]
        } catch (error) {
            console.error('Error updating flight by id:', error)
            throw error
        }
    },

    deleteById: async id => {
        try {
            const result = await db.query(
                'DELETE FROM flight WHERE id = $1 RETURNING *',
                [id]
            )
            return result.rows[0]
        } catch (error) {
            console.error('Error deleting flight by id:', error)
            throw error
        }
    }
}
