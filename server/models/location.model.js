import { db } from '../configs/db.config.js'

export const LocationModel = {
    async getAll() {
        const query = 'SELECT * FROM location'
        const { rows } = await db.query(query)
        return rows
    },

    async getById(id) {
        const query = 'SELECT * FROM location WHERE id = $1'
        const { rows } = await db.query(query, [id])
        return rows[0]
    },

    async getAllLocationsByParentId(parentId) {
        const query = `
        WITH RECURSIVE location_tree AS (
            SELECT * FROM location WHERE parent_id = $1
            UNION ALL
            SELECT l.* FROM location l
            INNER JOIN location_tree lt ON lt.id = l.parent_id
        )
        SELECT * FROM location_tree
    `
        const { rows } = await db.query(query, [parentId])
        return rows
    },

    async create(location) {
        const query =
            'INSERT INTO location (location_name, parent_id, level) VALUES ($1, $2, $3) RETURNING *'
        const { rows } = await db.query(query, [
            location.location_name,
            location.parent_id,
            location.level
        ])
        return rows[0]
    },

    async update(id, location) {
        const query =
            'UPDATE location SET location_name = $1, parent_id = $2, level = $3 WHERE id = $4 RETURNING *'
        const { rows } = await db.query(query, [
            location.location_name,
            location.parent_id,
            location.level,
            id
        ])
        return rows[0]
    },

    async delete(id) {
        const query = 'DELETE FROM location WHERE id = $1 RETURNING *'
        const { rows } = await db.query(query, [id])
        return rows[0]
    }
}
