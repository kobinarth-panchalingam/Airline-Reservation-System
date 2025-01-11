import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import aircraftModelRoutes from './routes/aircraft-model.routes.js'

const app = express()

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const baseUrl = 'api/v1'

app.use(`/${baseUrl}/aircraft-models`, aircraftModelRoutes)

app.get('/', (req, res) => {
  res.send('Welcome to the Airline Reservation System API')
})

export default app
