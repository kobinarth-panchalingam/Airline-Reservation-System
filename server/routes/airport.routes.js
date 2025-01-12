import express from 'express'
import { airportController } from '../controllers/airport.controller.js'

const router = express.Router()

router.get('/', airportController.getAllAirports)
router.get('/:code', airportController.getAirportByCode)
router.post('/', airportController.createAirport)
router.put('/:id', airportController.updateAirport)
router.delete('/:id', airportController.deleteAirport)

export { router as airportRoutes }
