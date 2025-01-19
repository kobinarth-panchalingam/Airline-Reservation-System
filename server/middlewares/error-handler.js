import { logger } from '../utils/logger.js'

export const errorHandler = (err, req, res, next) => {
    if (err) {
        logger.error(err)
        res.status(500).send({
            message: err.message
        })
    }
    next()
}
