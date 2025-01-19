import Joi from 'joi'

const aircraftModelSchema = {
    id: Joi.number(),
    model_name: Joi.string().required(),
    variant: Joi.string().required(),
    manufacturer_name: Joi.string().required(),
    seat_capacity: Joi.number().min(1).required(),
    max_load: Joi.number().min(1).required(),
    fuel_capacity: Joi.number().min(1).required(),
    average_speed: Joi.number().min(1).required()
}

export { aircraftModelSchema }
