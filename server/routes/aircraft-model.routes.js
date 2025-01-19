import express from 'express'
import {
    createAircraftModel,
    deleteAircraftModel,
    getAllAircraftModels,
    updateAircraftModel
} from '../controllers/aircraft-model.controller.js'
import { validate } from '../middlewares/validate.js'
import { aircraftModelSchema } from '../validators/aircraft-model.validation.js'

const router = express.Router()

router.get('/', getAllAircraftModels)
router.post('/', validate({ body: aircraftModelSchema }), createAircraftModel)
router.put('/:id', validate({ body: aircraftModelSchema }), updateAircraftModel)
router.delete('/:id', deleteAircraftModel)

export { router as aircraftModelRoutes }
