export const AirportModel = {
    create: async (client, data) => {
        const { airport_code, airport_name, locationId, image_url } = data
        const query = `INSERT INTO airport (airport_code, airport_name, location_id, image_url) VALUES ($1, $2, $3, $4) RETURNING *`
        const result = await client.query(query, [
            airport_code,
            airport_name,
            locationId,
            image_url
        ])
        return result.rows[0]
    },

    getAll: async client => {
        const result = await client.query(`
            SELECT a.*, 
                   c.location_name AS country, 
                   CASE 
                       WHEN s.id IS NOT NULL THEN s.location_name 
                       ELSE NULL 
                   END AS state, 
                   l.location_name AS city
            FROM airport a
            JOIN location l ON a.location_id = l.id
            LEFT JOIN location s ON l.parent_id = s.id AND s.level = 'state'
            LEFT JOIN location c ON (s.parent_id = c.id AND c.level = 'country') OR (l.parent_id = c.id AND c.level = 'country')
        `)
        return result.rows
    },

    getById: async (client, id) => {
        const result = await client.query(
            `
            SELECT a.*, 
                   c.location_name AS country, 
                   CASE 
                       WHEN s.id IS NOT NULL THEN s.location_name 
                       ELSE NULL 
                   END AS state, 
                   l.location_name AS city
            FROM airport a
            JOIN location l ON a.location_id = l.id
            LEFT JOIN location s ON l.parent_id = s.id AND s.level = 'state'
            LEFT JOIN location c ON (s.parent_id = c.id AND c.level = 'country') OR (l.parent_id = c.id AND c.level = 'country')
            WHERE a.id = $1
        `,
            [id]
        )
        return result.rows
    },

    getByCode: async (client, code) => {
        const result = await client.query(
            'SELECT * FROM airport WHERE airport_code = $1',
            [code]
        )
        return result.rows[0]
    },

    getAllByLocationId: async (client, locationId) => {
        const query = `
            WITH RECURSIVE location_tree AS (
                SELECT id, location_name, parent_id, level
                FROM location
                WHERE id = $1
                UNION ALL
                SELECT l.id, l.location_name, l.parent_id, l.level
                FROM location l
                INNER JOIN location_tree lt ON lt.id = l.parent_id
            )
            SELECT a.*, 
                   c.location_name AS country, 
                   CASE 
                       WHEN s.id IS NOT NULL THEN s.location_name 
                       ELSE NULL 
                   END AS state, 
                   l.location_name AS city
            FROM airport a
            JOIN location l ON a.location_id = l.id
            LEFT JOIN location s ON l.parent_id = s.id AND s.level = 'state'
            LEFT JOIN location c ON (s.parent_id = c.id AND c.level = 'country') OR (l.parent_id = c.id AND c.level = 'country')
            WHERE l.id IN (SELECT id FROM location_tree WHERE level = 'city')
        `
        const result = await client.query(query, [locationId])
        return result.rows
    },

    updateById: async (client, id, data) => {
        const { airport_code, airport_name, locationId, image_url } = data
        const query = `UPDATE airport SET airport_code = $1, airport_name = $2, location_id = $3, image_url = $4 WHERE id = $5 RETURNING *`
        const result = await client.query(query, [
            airport_code,
            airport_name,
            locationId,
            image_url,
            id
        ])
        return result.rows[0]
    },

    updateByCode: async (client, data) => {
        const { airport_code, airport_name, locationId, image_url } = data
        const query = `UPDATE airport SET airport_name = $1, location_id = $2, image_url = $3 WHERE airport_code = $4 RETURNING *`
        const result = await client.query(query, [
            airport_name,
            locationId,
            image_url,
            airport_code
        ])
        return result.rows[0]
    },

    deleteById: async (client, id) => {
        const query = 'DELETE FROM airport WHERE id = $1 RETURNING *'
        const result = await client.query(query, [id])
        return result.rows[0]
    }
}
