import Joi from 'joi'

const validationConfig = {
    abortEarly: false
}

export const validate = schema => {
    return async (req, res, next) => {
        try {
            for (const key of ['body', 'params', 'query']) {
                if (schema[key]) {
                    req[key] = await Joi.object(schema[key]).validateAsync(req[key], validationConfig)
                }
            }
        } catch (err) {
            return res.status(400).json({
                message: 'Validation error',
                error: err.details[0].message
            })
        }
        next()
    }
}
