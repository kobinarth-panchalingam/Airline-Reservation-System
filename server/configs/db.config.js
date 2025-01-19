import pg from 'pg'
const { Pool } = pg

const isProduction = process.env.NODE_ENV === 'production'

export const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    ssl: isProduction
        ? {
              rejectUnauthorized: false
          }
        : false
})

export const transaction = async callback => {
    const client = await client.connect()
    try {
        await client.query('BEGIN')
        console.log('Transaction started')
        const result = await callback(client)
        await client.query('COMMIT')
        console.log('Transaction committed')
        return result
    } catch (error) {
        console.error('Error during transaction', error)
        await client.query('ROLLBACK')
        throw error
    } finally {
        client.release()
    }
}
