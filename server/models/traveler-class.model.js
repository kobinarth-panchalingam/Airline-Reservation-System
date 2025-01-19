import { pool } from '../configs/db.config.js'

export const TravelerClass = {
    getAll: async () => {
        try {
            const result = await pool.query('SELECT * FROM traveler_class')
            return result.rows
        } catch (error) {
            console.error('Error fetching traveler classes:', error)
            throw error
        }
    },

    getById: async id => {
        try {
            const result = await pool.query('SELECT * FROM traveler_class WHERE id = $1', [id])
            return result.rows[0]
        } catch (error) {
            console.error('Error fetching traveler class by id:', error)
            throw error
        }
    },

    create: async data => {
        try {
            const result = await pool.query('INSERT INTO traveler_class (class_name) VALUES ($1) RETURNING *', [data.class_name])
            return result.rows[0]
        } catch (error) {
            console.error('Error creating traveler class:', error)
            throw error
        }
    },

    deleteById: async id => {
        try {
            const result = await pool.query('DELETE FROM traveler_class WHERE id = $1 RETURNING *', [id])
            return result.rows[0]
        } catch (error) {
            console.error('Error deleting traveler class:', error)
            throw error
        }
    }
}
