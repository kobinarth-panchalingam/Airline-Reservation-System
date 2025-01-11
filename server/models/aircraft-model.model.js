import { db } from '../configs/db.config.js'

export const AircraftModel = {
    create: async data => {
        try {
            const result = await db.query(
                'INSERT INTO aircraft_model (model_name, variant, manufacturer_name, seat_capacity, max_load, fuel_capacity, average_speed) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [
                    data.model_name,
                    data.variant,
                    data.manufacturer_name,
                    data.seat_capacity,
                    data.max_load,
                    data.fuel_capacity,
                    data.average_speed
                ]
            )
            return result.rows[0]
        } catch (error) {
            console.error('Error creating aircraft model:', error)
            throw error
        }
    },

    getAll: async () => {
        try {
            const result = await db.query('SELECT * FROM aircraft_model')
            return result.rows
        } catch (error) {
            console.error('Error fetching aircraft models:', error)
            throw error
        }
    },

    getById: async id => {
        try {
            const result = await db.query(
                'SELECT * FROM aircraft_model WHERE id = $1',
                [id]
            )
            return result.rows[0]
        } catch (error) {
            console.error('Error fetching aircraft model by id:', error)
            throw error
        }
    },

    updateById: async (id, data) => {
        try {
            const result = await db.query(
                'UPDATE aircraft_model SET model_name = $1, variant = $2, manufacturer_name = $3, seat_capacity = $4, max_load = $5, fuel_capacity = $6, average_speed = $7 WHERE id = $8 RETURNING *',
                [
                    data.model_name,
                    data.variant,
                    data.manufacturer_name,
                    data.seat_capacity,
                    data.max_load,
                    data.fuel_capacity,
                    data.average_speed,
                    id
                ]
            )
            return result.rows[0]
        } catch (error) {
            console.error('Error updating aircraft model:', error)
            throw error
        }
    },

    deleteById: async id => {
        try {
            const result = await db.query(
                'DELETE FROM aircraft_model WHERE id = $1 RETURNING *',
                [id]
            )
            return result.rows[0]
        } catch (error) {
            console.error('Error deleting aircraft model:', error)
            throw error
        }
    }
}
