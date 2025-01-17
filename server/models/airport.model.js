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
        // return db.transaction(async client => {
        //     const {
        //         airport_code,
        //         airport_name,
        //         country,
        //         state,
        //         city,
        //         image_url
        //     } = data

        //     const locationQuery =
        //         'SELECT location_id FROM airport WHERE id = $1'
        //     const locationId = await client.query(locationQuery, [id])

        //     if (city) {
        //         const cityQuery =
        //             'UPDATE location SET location_name = $1 WHERE id = $2 RETURNING parent_id'
        //         const cityId = await client.query(cityQuery, [
        //             city,
        //             locationId.rows[0].location_id
        //         ])
        //         if (state) {
        //             const stateQuery =
        //                 'UPDATE location SET location_name = $1 WHERE id = $2 RETURNING parent_id'
        //             const stateId = await client.query(stateQuery, [
        //                 state,
        //                 cityId.rows[0].parent_id
        //             ])
        //             if (country) {
        //                 const countryQuery =
        //                     'UPDATE location SET location_name = $1 WHERE id = $2'
        //                 await client.query(countryQuery, [
        //                     country,
        //                     stateId.rows[0].parent_id
        //                 ])
        //             }
        //         } else if (country) {
        //             const stateQuery =
        //                 'SELECT parent_id FROM location WHERE id = $1'
        //             const stateId = await client.query(stateQuery, [
        //                 cityId.rows[0].parent_id
        //             ])
        //             const countryQuery =
        //                 'UPDATE location SET location_name = $1 WHERE id = $2'
        //             await client.query(countryQuery, [
        //                 country,
        //                 stateId.rows[0].parent_id
        //             ])
        //         }
        //     } else if (state) {
        //         const stateQuery =
        //             'UPDATE location SET location_name = $1 WHERE id = $2 RETURNING parent_id'
        //         const stateId = await client.query(stateQuery, [
        //             state,
        //             locationId.rows[0].location_id
        //         ])
        //         if (country) {
        //             const countryQuery =
        //                 'UPDATE location SET location_name = $1 WHERE id = $2'
        //             await client.query(countryQuery, [
        //                 country,
        //                 stateId.rows[0].parent_id
        //             ])
        //         }
        //     } else if (country) {
        //         const countryQuery =
        //             'UPDATE location SET location_name = $1 WHERE id = $2'
        //         await client.query(countryQuery, [
        //             country,
        //             locationId.rows[0].location_id
        //         ])
        //     }

        //     const fields = []
        //     const values = []
        //     let query = 'UPDATE airport SET '

        //     if (airport_code) {
        //         fields.push('airport_code')
        //         values.push(airport_code)
        //     }
        //     if (airport_name) {
        //         fields.push('airport_name')
        //         values.push(airport_name)
        //     }
        //     if (image_url) {
        //         fields.push('image_url')
        //         values.push(image_url)
        //     }

        //     fields.forEach((field, index) => {
        //         query += `${field} = $${index + 1}`
        //         if (index < fields.length - 1) {
        //             query += ', '
        //         }
        //     })

        //     query += ` WHERE id = $${fields.length + 1} RETURNING *`
        //     values.push(id)

        //     const result = await client.query(query, values)

        //     return result.rows[0]
        // })
    },

    deleteById: async (client, id) => {
        const query = 'DELETE FROM airport WHERE id = $1 RETURNING *'
        const result = await client.query(query, [id])
        return result.rows[0]
        // return db.transaction(async client => {
        //     const query = 'DELETE FROM airport WHERE id = $1 RETURNING *'
        //     const { rows } = await client.query(query, [id])
        //     return rows[0]
        // })
    }
}
