import express from 'express'
import { locationController } from '../controllers/location.controller.js'

const router = express.Router()

router.get('/', locationController.getAllLocations)
router.get('/:id', locationController.getById)
router.get('/parent/:parentId', locationController.getAllLocationsByParentId)
router.post('/', locationController.createLocation)
router.put('/:id', locationController.updateLocation)
router.delete('/:id', locationController.deleteLocation)

export { router as locationRoutes }
