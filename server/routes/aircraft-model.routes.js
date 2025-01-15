import express from 'express'
import { aircraftModelController } from '../controllers/aircraft-model.controller.js'

const router = express.Router()

router.get('/', aircraftModelController.getAllAircraftModels)
router.post('/', aircraftModelController.createAircraftModel)
router.put('/:id', aircraftModelController.updateAircraftModel)
router.delete('/:id', aircraftModelController.deleteAircraftModel)

export { router as aircraftModelRoutes }
