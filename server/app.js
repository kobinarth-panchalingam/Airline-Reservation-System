import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import { responseFormatter } from './middleware/response-formatter.js'
import { aircraftModelRoutes } from './routes/aircraft-model.routes.js'
import { flightModelRoutes } from './routes/flight-model.routes.js'
import { airportRoutes } from './routes/airport.routes.js'
import { locationRoutes } from './routes/location.routes.js'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const baseUrl = 'api/v1'
app.use(`/${baseUrl}/aircraft-models`, aircraftModelRoutes)
app.use(`/${baseUrl}/flights`, flightModelRoutes)
app.use(`/${baseUrl}/airports`, airportRoutes)
app.use(`/${baseUrl}/locations`, locationRoutes)

app.get('/', (req, res) => {
    res.send('Welcome to the Airline Reservation System API')
})

app.use(responseFormatter)

export { app }
