import express from 'express'
import { aircraftModelController } from '../controllers/aircraft-model.controller.js'

const router = express.Router()

router.get('/', aircraftModelController.getAllAircraftModels)

export default router
