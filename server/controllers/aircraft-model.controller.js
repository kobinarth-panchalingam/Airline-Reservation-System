import _ from 'lodash'
import { db } from '../configs/db.config.js'
import { AircraftModel } from '../models/aircraft-model.model.js'

const getAllAircraftModels = async (req, res) => {
    const aircraftModels = await AircraftModel.getAll(db)
    res.json(aircraftModels)
}

const createAircraftModel = async (req, res) => {
    const aircraftModel = await AircraftModel.create(
        db,
        ...Object.values(
            _.pick(req.body, ['model_name', 'variant', 'manufacturer_name', 'seat_capacity', 'max_load', 'fuel_capacity', 'average_speed'])
        )
    )
    res.json(aircraftModel)
}

const updateAircraftModel = async (req, res) => {
    const aircraftModel = await AircraftModel.updateById(
        db,
        req.params.id,
        ...Object.values(
            _.pick(req.body, ['model_name', 'variant', 'manufacturer_name', 'seat_capacity', 'max_load', 'fuel_capacity', 'average_speed'])
        )
    )
    res.json(aircraftModel)
}

const deleteAircraftModel = async (req, res) => {
    const aircraftModel = await AircraftModel.deleteById(db, req.params.id)
    res.json(aircraftModel)
}

export { getAllAircraftModels, createAircraftModel, updateAircraftModel, deleteAircraftModel }
