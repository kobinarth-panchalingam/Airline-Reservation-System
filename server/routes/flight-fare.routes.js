import express from 'express'
import { flightFareController } from '../controllers/flight-fare.controller.js'

const router = express.Router()

router.get('/', flightFareController.getAllFlightFares)
router.get('/:id', flightFareController.getFlightFareById)
router.post('/', flightFareController.createFlightFare)
router.put('/:id', flightFareController.updateFlightFareById)
router.delete('/:id', flightFareController.deleteFlightFareById)

export { router as flightFareRoutes }
