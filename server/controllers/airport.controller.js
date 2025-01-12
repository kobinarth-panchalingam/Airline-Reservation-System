import { AirportModel } from '../models/airport.model.js'

export const airportController = {
    getAllAirports: async (req, res) => {
        try {
            const airports = await AirportModel.getAll()
            res.json(airports)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    getAirportById: async (req, res) => {
        try {
            const airport = await AirportModel.getById(req.params.id)
            if (!airport) {
                res.status(404).json({ message: 'Airport not found' })
                return
            }
            res.json(airport)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    createAirport: async (req, res) => {
        try {
            const airport = await AirportModel.create(req.body)
            res.status(201).json(airport)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    updateAirport: async (req, res) => {
        try {
            const airport = await AirportModel.updateById(
                req.params.id,
                req.body
            )
            if (!airport) {
                res.status(404).json({ message: 'Airport not found' })
                return
            }
            res.json(airport)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    deleteAirport: async (req, res) => {
        try {
            const airport = await AirportModel.deleteById(req.params.id)
            if (!airport) {
                res.status(404).json({ message: 'Airport not found' })
                return
            }
            res.json(airport)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}
