import { FlightFare } from '../models/flight-fare.model.js'

export const flightFareController = {
    createFlightFare: async (req, res) => {
        try {
            const flightFare = await FlightFare.create(req.body)
            res.status(201).json(flightFare)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    getAllFlightFares: async (req, res) => {
        try {
            const flightFares = await FlightFare.getAll()
            res.json(flightFares)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    getFlightFareById: async (req, res) => {
        try {
            const flightFare = await FlightFare.getById(req.params.id)
            if (!flightFare) {
                res.status(404).json({ message: 'Flight Fare not found' })
                return
            }
            res.json(flightFare)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    updateFlightFareById: async (req, res) => {
        try {
            const flightFare = await FlightFare.updateById(
                req.params.id,
                req.body
            )
            if (!flightFare) {
                res.status(404).json({ message: 'Flight Fare not found' })
                return
            }
            res.json(flightFare)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    deleteFlightFareById: async (req, res) => {
        try {
            const flightFare = await FlightFare.deleteById(req.params.id)
            if (!flightFare) {
                res.status(404).json({ message: 'Flight Fare not found' })
                return
            }
            res.json(flightFare)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}
