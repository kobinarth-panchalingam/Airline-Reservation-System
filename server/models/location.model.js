export const LocationModel = {
    getAll: async client => {
        const result = await client.query('SELECT * FROM location')
        return result.rows
    },

    getById: async (client, id) => {
        const result = await client.query(
            'SELECT * FROM location WHERE id = $1',
            [id]
        )
        return result.rows
    },

    getByNameAndLevel: async (client, locationName, level) => {
        const query =
            'SELECT * FROM location WHERE location_name = $1 AND level = $2'
        const result = client.query(query, [locationName, level])
        return result.rows
    },

    getAllLocationsByParentId: async (client, parentId) => {
        const result = await client.query(
            'SELECT * FROM location WHERE parent_id = $1',
            [parentId]
        )
        return result.rows
        // return db.transaction(async client => {
        //     const query = `
        //     WITH RECURSIVE location_tree AS (
        //         SELECT * FROM location WHERE parent_id = $1
        //         UNION ALL
        //         SELECT l.* FROM location l
        //         INNER JOIN location_tree lt ON lt.id = l.parent_id
        //     )
        //     SELECT * FROM location_tree
        //     `
        //     const { rows } = await client.query(query, [parentId])
        //     return rows
        // })
    },

    create: async (client, location_name, parent_id, level) => {
        const result = await client.query(
            'INSERT INTO location (location_name, parent_id, level) VALUES ($1, $2, $3) RETURNING *',
            [location_name, parent_id, level]
        )
        return result.rows
        // return db.transaction(async client => {
        //     const query =
        //         'INSERT INTO location (location_name, parent_id, level) VALUES ($1, $2, $3) RETURNING *'
        //     const { rows } = await client.query(query, [
        //         location.location_name,
        //         location.parent_id,
        //         location.level
        //     ])
        //     return rows
        // })
    },

    update: async (client, location_name, parent_id, level, id) => {
        const result = await client.query(
            'UPDATE location SET location_name = $1, parent_id = $2, level = $3 WHERE id = $4 RETURNING *',
            [location_name, parent_id, level, id]
        )
        return result.rows
        // return db.transaction(async client => {
        //     const query =
        //         'UPDATE location SET location_name = $1, parent_id = $2, level = $3 WHERE id = $4 RETURNING *'
        //     const { rows } = await client.query(query, [
        //         location.location_name,
        //         location.parent_id,
        //         location.level,
        //         id
        //     ])
        //     return rows
        // })
    },

    delete: async (client, id) => {
        const result = await client.query(
            'DELETE FROM location WHERE id = $1 RETURNING *',
            [id]
        )
        return result.rows
        // return db.transaction(async client => {
        //     const query = 'DELETE FROM location WHERE id = $1 RETURNING *'
        //     const { rows } = await client.query(query, [id])
        //     return rows
        // })
    }
}
