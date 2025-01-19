import { app } from './app.js'
import { db } from './configs/db.config.js'
import { logger } from './utils/logger.js'

const PORT = process.env.PORT || 4000

db.connect()
    .then(client => {
        logger.info('Successfully connected to database')
        client.release()
    })
    .catch(err => {
        logger.error('error connecting to database\n', err)
    })

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`)
})
