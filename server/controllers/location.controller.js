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

    getById: async (req, res) => {
        try {
            const location = await LocationModel.getById(req.params.id)
            if (!location) {
                res.status(404).json({ message: 'Location not found' })
                return
            }
            res.json(location)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    getAllLocationsByParentId: async (req, res) => {
        try {
            const locations = await LocationModel.getAllLocationsByParentId(
                req.params.parentId
            )
            res.json(locations)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    createLocation: async (req, res) => {
        try {
            const location = await LocationModel.create(req.body)
            res.status(201).json(location)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    updateLocation: async (req, res) => {
        try {
            const location = await LocationModel.update(req.params.id, req.body)
            if (!location) {
                res.status(404).json({ message: 'Location not found' })
                return
            }
            res.json(location)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    deleteLocation: async (req, res) => {
        try {
            const location = await LocationModel.delete(req.params.id)
            if (!location) {
                res.status(404).json({ message: 'Location not found' })
                return
            }
            res.json(location)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}
