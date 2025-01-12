import { FlightModel } from '../models/flight-model.model.js'

export const flightModelController = {
    getAllFlights: async (req, res) => {
        try {
            const flights = await FlightModel.getAll()
            res.json(flights)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    getFlightById: async (req, res) => {
        try {
            const flight = await FlightModel.getById(req.params.id)
            res.json(flight)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    createFlight: async (req, res) => {
        try {
            const flight = await FlightModel.create(req.body)
            res.json(flight)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    updateFlightById: async (req, res) => {
        try {
            const updateFlight = await FlightModel.updateById(
                req.params.id,
                req.body
            )
            res.json(updateFlight)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    deleteFlightById: async (req, res) => {
        try {
            await FlightModel.deleteById(req.params.id)
            res.json({ message: `Flight with id ${req.params.id} deleted` })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}
