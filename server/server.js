import { app } from './app.js'
import { db } from './configs/db.config.js'

const PORT = process.env.PORT || 4000

db.connect()
    .then(() => {
        console.log('Connected to PostgreSQL Database')
    })
    .catch(err => {
        console.error('Error connecting to PostgreSQL database', err)
    })

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
