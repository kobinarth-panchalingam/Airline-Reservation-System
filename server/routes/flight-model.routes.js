import express from 'express'
import { createFlight, deleteFlightById, getAllFlights, getFlightById, updateFlightById } from '../controllers/flight-model.controller.js'
import { validate } from '../middlewares/validate.js'
import { flightSchema } from '../validators/flight.validation.js'

const router = express.Router()

router.get('/', getAllFlights)
router.post('/', validate({ body: flightSchema }), createFlight)
router.get('/:id', validate({ params: { id: flightSchema.id } }), getFlightById)
router.put('/:id', validate({ body: flightSchema }), updateFlightById)
router.delete('/:id', deleteFlightById)

export { router as flightModelRoutes }
