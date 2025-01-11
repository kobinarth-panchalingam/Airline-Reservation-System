import { AircraftModel } from '../models/aircraft-model.model.js'

export const aircraftModelController = {
    getAllAircraftModels: async (req, res) => {
        try {
            const aircraftModels = await AircraftModel.getAll()
            res.json(aircraftModels)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}
