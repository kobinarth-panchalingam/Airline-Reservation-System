const create = async (db, model_name, variant, manufacturer_name, seat_capacity, max_load, fuel_capacity, average_speed) => {
    const sql = `
        INSERT INTO aircraft_model (model_name, variant, manufacturer_name, seat_capacity, max_load, fuel_capacity, average_speed)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `
    const values = [model_name, variant, manufacturer_name, seat_capacity, max_load, fuel_capacity, average_speed]
    const result = await db.query(sql, values)
    return result.rows[0]
}

const getById = async (db, id) => {
    const sql = `
        SELECT * FROM aircraft_model WHERE id = $1
    `
    const values = [id]
    const result = await db.query(sql, values)
    return result.rows[0]
}

const getAll = async db => {
    const sql = `
        SELECT * FROM aircraft_model
    `
    const result = await db.query(sql)
    return result.rows
}

const deleteById = async (db, id) => {
    const sql = `
        DELETE FROM aircraft_model WHERE id = $1 RETURNING *
    `
    const values = [id]
    const result = await db.query(sql, values)
    return result.rows[0]
}

const updateById = async (db, id, model_name, variant, manufacturer_name, seat_capacity, max_load, fuel_capacity, average_speed) => {
    const sql = `
        UPDATE aircraft_model 
        SET model_name = $1, variant = $2, manufacturer_name = $3, seat_capacity = $4, max_load = $5, fuel_capacity = $6, average_speed = $7
        WHERE id = $8 RETURNING *
    `
    const values = [model_name, variant, manufacturer_name, seat_capacity, max_load, fuel_capacity, average_speed, id]
    const result = await db.query(sql, values)
    return result.rows[0]
}

export const AircraftModel = {
    create,
    getById,
    getAll,
    deleteById,
    updateById
}
