const create = async (client, model_name, variant, manufacturer_name, seat_capacity, max_load, fuel_capacity, average_speed) => {
    const sql = `
        INSERT INTO aircraft_model (model_name, variant, manufacturer_name, seat_capacity, max_load, fuel_capacity, average_speed)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `
    const values = [model_name, variant, manufacturer_name, seat_capacity, max_load, fuel_capacity, average_speed]
    const result = await client.query(sql, values)
    return result.rows[0]
}

const getById = async (cliient, id) => {
    const sql = `
        SELECT * FROM aircraft_model WHERE id = $1
    `
    const values = [id]
    const result = await cliient.query(sql, values)
    return result.rows[0]
}

const getAll = async client => {
    const sql = `
        SELECT * FROM aircraft_model
    `
    const result = await client.query(sql)
    return result.rows
}

const deleteById = async (client, id) => {
    const sql = `
        DELETE FROM aircraft_model WHERE id = $1 RETURNING *
    `
    const values = [id]
    const result = await client.query(sql, values)
    return result.rows[0]
}

const updateById = async (client, id, model_name, variant, manufacturer_name, seat_capacity, max_load, fuel_capacity, average_speed) => {
    const sql = `
        UPDATE aircraft_model 
        SET model_name = $1, variant = $2, manufacturer_name = $3, seat_capacity = $4, max_load = $5, fuel_capacity = $6, average_speed = $7
        WHERE id = $8 RETURNING *
    `
    const values = [model_name, variant, manufacturer_name, seat_capacity, max_load, fuel_capacity, average_speed, id]
    const result = await client.query(sql, values)
    return result.rows[0]
}

export const AircraftModel = {
    create,
    getById,
    getAll,
    deleteById,
    updateById
}
