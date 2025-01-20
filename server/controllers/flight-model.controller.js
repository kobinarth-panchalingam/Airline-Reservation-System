import _ from 'lodash'
import { pool } from '../configs/db.config.js'
import { FlightModel } from '../models/flight-model.model.js'

const getAllFlights = async (req, res) => {
    const flights = await FlightModel.getAll(pool)
    res.json(flights)
}

const getFlightById = async (req, res) => {
    const flight = await FlightModel.getById(pool, req.params.id)
    res.json(flight)
}

const createFlight = async (req, res) => {
    const flight = await FlightModel.create(
        pool,
        ...Object.values(_.pick(req.body, ['airplane_id', 'route_id', 'departure_time', 'arrival_time', 'flight_status']))
    )
    res.json(flight)
}

const updateFlightById = async (req, res) => {
    const flight = await FlightModel.updateById(
        pool,
        req.params.id,
        ...Object.values(_.pick(req.body, ['airplane_id', 'route_id', 'departure_time', 'arrival_time', 'flight_status']))
    )
    res.json(flight)
}

const deleteFlightById = async (req, res) => {
    const flight = await FlightModel.deleteById(pool, req.params.id)
    res.json(flight)
}

export { getAllFlights, getFlightById, createFlight, updateFlightById, deleteFlightById }
