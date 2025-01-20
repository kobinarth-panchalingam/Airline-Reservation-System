const create = async (client, airplane_id, route_id, departure_time, arrival_time, flight_status) => {
    const sql = `
        INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status)
        VALUES ($1, $2, $3, $4, $5) RETURNING *
    `
    const values = [airplane_id, route_id, departure_time, arrival_time, flight_status]
    const result = await client.query(sql, values)
    return result.rows[0]
}

const getById = async (cliient, id) => {
    const sql = `
        SELECT * FROM flight WHERE id = $1
    `
    const values = [id]
    const result = await cliient.query(sql, values)
    return result.rows[0]
}

const getAll = async client => {
    const sql = `
        SELECT * FROM flight
    `
    const result = await client.query(sql)
    return result.rows
}

const deleteById = async (client, id) => {
    const sql = `
        DELETE FROM flight WHERE id = $1 RETURNING *
    `
    const values = [id]
    const result = await client.query(sql, values)
    return result.rows[0]
}

const updateById = async (client, id, airplane_id, route_id, departure_time, arrival_time, flight_status) => {
    const sql = `
        UPDATE flight 
        SET airplane_id = $1, route_id = $2, departure_time = $3, arrival_time = $4, flight_status = $5
        WHERE id = $6 RETURNING *
    `
    const values = [airplane_id, route_id, departure_time, arrival_time, flight_status, id]
    const result = await client.query(sql, values)
    return result.rows[0]
}

export const FlightModel = {
    create,
    getById,
    getAll,
    deleteById,
    updateById
}
