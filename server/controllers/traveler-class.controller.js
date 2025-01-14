import { TravelerClass } from '../models/traveler-class.model.js'

export const travelerClassController = {
    createTravelerClass: async (req, res) => {
        try {
            const travelerClass = await TravelerClass.create(req.body)
            res.status(201).json(travelerClass)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    getAllTravelerClasses: async (req, res) => {
        try {
            const travelerClasses = await TravelerClass.getAll()
            res.json(travelerClasses)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    getAllTravelerClassesById: async (req, res) => {
        try {
            const travelerClasses = await TravelerClass.getById(req.params.id)
            res.json(travelerClasses)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    deleteTravelerClass: async (req, res) => {
        try {
            const travelerClass = await TravelerClass.deleteById(req.params.id)
            if (!travelerClass) {
                res.status(404).json({ message: 'Traveler class not found' })
                return
            }
            res.json(travelerClass)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}
