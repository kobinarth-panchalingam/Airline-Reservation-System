import { LocationModel } from '../models/location.model.js'

export const locationController = {
    getAllLocations: async (req, res) => {
        try {
            const locations = await LocationModel.getAll()
            res.json(locations)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    getAllLocationsByParentId: async (req, res) => {
        try {
            const locations = await LocationModel.getAllLocationsByParentId(
                req.params.id
            )
            res.json(locations)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}
