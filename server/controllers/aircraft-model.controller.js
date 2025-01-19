import _ from 'lodash'
import { pool, transaction } from '../configs/db.config.js'
import { AircraftModel } from '../models/aircraft-model.model.js'

const getAllAircraftModels = async (req, res) => {
    const aircraftModels = await AircraftModel.getAll(pool)
    res.json(aircraftModels)
}

const createAircraftModel = async (req, res) => {
    const aircraftModel = await AircraftModel.create(
        pool,
        ...Object.values(
            _.pick(req.body, ['model_name', 'variant', 'manufacturer_name', 'seat_capacity', 'max_load', 'fuel_capacity', 'average_speed'])
        )
    )
    res.json(aircraftModel)
}

const updateAircraftModel = async (req, res) => {
    const aircraftModel = await AircraftModel.updateById(
        pool,
        req.params.id,
        ...Object.values(
            _.pick(req.body, ['model_name', 'variant', 'manufacturer_name', 'seat_capacity', 'max_load', 'fuel_capacity', 'average_speed'])
        )
    )
    res.json(aircraftModel)
}

const deleteAircraftModel = async (req, res) => {
    const aircraftModel = await AircraftModel.deleteById(pool, req.params.id)
    res.json(aircraftModel)
}

const updateAircraftModelWithTransaction = async (req, res) => {
    const result = await transaction(async client => {
        return await AircraftModel.updateById(
            client,
            req.params.id,
            ...Object.values(
                _.pick(req.body, [
                    'model_name',
                    'variant',
                    'manufacturer_name',
                    'seat_capacity',
                    'max_load',
                    'fuel_capacity',
                    'average_speed'
                ])
            )
        )
    })

    res.json(result)
}

export { getAllAircraftModels, createAircraftModel, updateAircraftModel, deleteAircraftModel, updateAircraftModelWithTransaction }
