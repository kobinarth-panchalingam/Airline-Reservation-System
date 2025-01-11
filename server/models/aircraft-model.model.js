import db from '../configs/db.config.js'

export const AircraftModel = {
  getAll: async () => {
    try {
      const result = await db.query('SELECT * FROM aircraft_model')
      return result.rows
    } catch (error) {
      console.error('Error fetching aircraft models:', error)
      throw error
    }
  }
}
