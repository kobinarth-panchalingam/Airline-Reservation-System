import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the Airline Reservation System API')
})

export default app
