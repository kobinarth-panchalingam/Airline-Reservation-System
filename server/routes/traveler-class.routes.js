import express from 'express'
import { travelerClassController } from '../controllers/traveler-class.controller.js'

const router = express.Router()

router.post('/', travelerClassController.createTravelerClass)
router.get('/', travelerClassController.getAllTravelerClasses)
router.get('/:id', travelerClassController.getAllTravelerClassesById)
router.delete('/:id', travelerClassController.deleteTravelerClass)

export { router as travelerClassRoutes }
