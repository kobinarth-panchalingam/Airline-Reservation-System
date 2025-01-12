import pg from 'pg'
const { Client } = pg

export const db = new Client({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    ssl: {
        rejectUnauthorized: false
    }
})
