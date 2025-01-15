import { AircraftModel } from '../models/aircraft-model.model.js'

export const aircraftModelController = {
    getAllAircraftModels: async (req, res) => {
        try {
            const aircraftModels = await AircraftModel.getAll()
            res.json(aircraftModels)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    createAircraftModel: async (req, res) => {
        try {
            const aircraftModel = await AircraftModel.create(req.body)
            res.json(aircraftModel)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    updateAircraftModel: async (req, res) => {
        try {
            const aircraftModel = await AircraftModel.updateById(
                req.params.id,
                req.body
            )
            res.json(aircraftModel)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    deleteAircraftModel: async (req, res) => {
        try {
            const aircraftModel = await AircraftModel.deleteById(req.params.id)
            res.json(aircraftModel)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}
