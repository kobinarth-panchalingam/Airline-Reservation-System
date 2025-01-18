import pg from 'pg'
const { Pool } = pg

const isProduction = process.env.NODE_ENV === 'production'

const pool = new Pool({
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

export const db = {
    query: async (text, params) => {
        const start = Date.now()
        try {
            const res = await pool.query(text, params)
            const duration = Date.now() - start
            console.log('executed query', {
                text,
                duration,
                rows: res.rowCount
            })
            return res
        } catch (error) {
            console.error('Error executing query', { text, error })
            throw error
        }
    },
    getClient: async () => {
        const client = await pool.connect()
        const query = client.query
        const release = client.release
        // set a timeout of 5 seconds, after which we will log this client's last query
        const timeout = setTimeout(() => {
            console.error(
                'A client has been checked out for more than 5 seconds!'
            )
            console.error(
                `The last executed query on this client was: ${client.lastQuery}`
            )
        }, 5000)
        // monkey patch the query method to keep track of the last query executed
        client.query = (...args) => {
            client.lastQuery = args
            return query.apply(client, args)
        }
        client.release = () => {
            // clear our timeout
            clearTimeout(timeout)
            // set the methods back to their old un-monkey-patched version
            client.query = query
            client.release = release
            return release.apply(client)
        }
        return client
    },

    transaction: async callback => {
        const client = await db.getClient()
        try {
            await client.query('BEGIN')
            const result = await callback(client)
            await client.query('COMMIT')
            return result
        } catch (error) {
            await client.query('ROLLBACK')
            throw error
        } finally {
            client.release()
        }
    }
}
