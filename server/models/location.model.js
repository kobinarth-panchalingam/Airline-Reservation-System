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
        return result.rows[0]
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

    create: async (client, location) => {
        const result = await client.query(
            'INSERT INTO location (location_name, parent_id, level) VALUES ($1, $2, $3) RETURNING *',
            [location.location_name, location.parent_id, location.level]
        )
        return result.rows[0]
        // return db.transaction(async client => {
        //     const query =
        //         'INSERT INTO location (location_name, parent_id, level) VALUES ($1, $2, $3) RETURNING *'
        //     const { rows } = await client.query(query, [
        //         location.location_name,
        //         location.parent_id,
        //         location.level
        //     ])
        //     return rows[0]
        // })
    },

    update: async (client, id, location) => {
        const result = await client.query(
            'UPDATE location SET location_name = $1, parent_id = $2, level = $3 WHERE id = $4 RETURNING *',
            [location.location_name, location.parent_id, location.level, id]
        )
        return result.rows[0]
        // return db.transaction(async client => {
        //     const query =
        //         'UPDATE location SET location_name = $1, parent_id = $2, level = $3 WHERE id = $4 RETURNING *'
        //     const { rows } = await client.query(query, [
        //         location.location_name,
        //         location.parent_id,
        //         location.level,
        //         id
        //     ])
        //     return rows[0]
        // })
    },

    delete: async (client, id) => {
        const result = await client.query(
            'DELETE FROM location WHERE id = $1 RETURNING *',
            [id]
        )
        return result.rows[0]
        // return db.transaction(async client => {
        //     const query = 'DELETE FROM location WHERE id = $1 RETURNING *'
        //     const { rows } = await client.query(query, [id])
        //     return rows[0]
        // })
    }
}
