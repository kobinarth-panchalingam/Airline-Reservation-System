import express from 'express'
import { airportController } from '../controllers/airport.controller.js'

const router = express.Router()

router.get('/', airportController.getAllAirports)
router.get('/:id', airportController.getAirportById)
router.get('/location/:location_id', airportController.getAirportsByLocationId)
router.post('/', airportController.createAirport)
router.put('/:code', airportController.updateAirportByCode)
router.delete('/:id', airportController.deleteAirport)

export { router as airportRoutes }
