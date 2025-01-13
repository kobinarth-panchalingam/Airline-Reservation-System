import { app } from './app.js'
import { db } from './configs/db.config.js'

const PORT = process.env.PORT || 4000

db.getClient()
    .then(client => {
        console.log('Successfully connected to database')
        client.release()
    })
    .catch(err => {
        console.error('error connecting to database\n', err)
    })

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
