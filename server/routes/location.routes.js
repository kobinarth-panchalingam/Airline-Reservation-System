import express from 'express'
import { locationController } from '../controllers/location.controller.js'

const router = express.Router()

router.get('/', locationController.getAllLocations)
router.get('/:id', locationController.getAllLocationsByParentId)

export { router as locationRoutes }
