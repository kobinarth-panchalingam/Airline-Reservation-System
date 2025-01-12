import express from 'express'
import { flightModelController } from '../controllers/flight-model.controller.js'

const router = express.Router()

router.get('/', flightModelController.getAllFlights)
router.get('/:id', flightModelController.getFlightById)
router.post('/', flightModelController.createFlight)
router.put('/:id', flightModelController.updateFlightById)
router.delete('/:id', flightModelController.deleteFlightById)

export { router as flightModelRoutes }
