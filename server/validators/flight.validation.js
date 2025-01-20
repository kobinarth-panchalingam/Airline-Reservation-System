import Joi from 'joi'

const flightSchema = {
    id: Joi.number(),
    airplane_id: Joi.number().required(),
    route_id: Joi.number().required(),
    departure_time: Joi.date().required(),
    arrival_time: Joi.date().required(),
    flight_status: Joi.string().required()
}

export { flightSchema }
