import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import 'express-async-errors'
import helmet from 'helmet'

import { errorHandler } from './middlewares/error-handler.js'
import { aircraftModelRoutes } from './routes/aircraft-model.routes.js'
import { airportRoutes } from './routes/airport.routes.js'
import { flightFareRoutes } from './routes/flight-fare.routes.js'
import { flightModelRoutes } from './routes/flight-model.routes.js'
import { locationRoutes } from './routes/location.routes.js'
import { travelerClassRoutes } from './routes/traveler-class.routes.js'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())

const baseUrl = 'api/v1'
app.use(`/${baseUrl}/aircraft-models`, aircraftModelRoutes)
app.use(`/${baseUrl}/flights`, flightModelRoutes)
app.use(`/${baseUrl}/airports`, airportRoutes)
app.use(`/${baseUrl}/locations`, locationRoutes)
app.use(`/${baseUrl}/flight-fares`, flightFareRoutes)
app.use(`/${baseUrl}/traveler-class`, travelerClassRoutes)
app.use(errorHandler)

export { app }
