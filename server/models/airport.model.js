import { db } from '../configs/db.config.js'

export const AirportModel = {
    /**
     *
     * @param {Object} data
     * @param {string} data.airport_code
     * @param {string} data.airport_name
     * @param {string} data.country
     * @param {string} data.state
     * @param {string} data.city
     * @param {string} data.image_url
     * add a new airport to the database as well as the location details (country, state, city) to the location table
     * @returns {Promise<Object>} Returns the newly created airport
     */
    create: async data => {
        const { airport_code, airport_name, country, state, city, image_url } =
            data
        return db.transaction(async client => {
            // Check if the country exists
            const countryQuery =
                'SELECT id FROM location WHERE location_name = $1 AND level = $2'
            let countryResult = await client.query(countryQuery, [
                country,
                'country'
            ])
            let countryId

            if (countryResult.rows.length > 0) {
                countryId = countryResult.rows[0].id
            } else {
                const insertCountryQuery =
                    'INSERT INTO location (location_name, parent_id, level) VALUES ($1, $2, $3) RETURNING id'
                countryResult = await client.query(insertCountryQuery, [
                    country,
                    null,
                    'country'
                ])
                countryId = countryResult.rows[0].id
            }

            let parentId = countryId

            // Check if the state exists
            if (state) {
                const stateQuery =
                    'SELECT id FROM location WHERE location_name = $1 AND level = $2 AND parent_id = $3'
                let stateResult = await client.query(stateQuery, [
                    state,
                    'state',
                    countryId
                ])
                let stateId

                if (stateResult.rows.length > 0) {
                    stateId = stateResult.rows[0].id
                } else {
                    const insertStateQuery =
                        'INSERT INTO location (location_name, parent_id, level) VALUES ($1, $2, $3) RETURNING id'
                    stateResult = await client.query(insertStateQuery, [
                        state,
                        countryId,
                        'state'
                    ])
                    stateId = stateResult.rows[0].id
                }

                parentId = stateId
            }

            // Check if the city exists
            const cityQuery =
                'SELECT id FROM location WHERE location_name = $1 AND level = $2 AND parent_id = $3'
            let cityResult = await client.query(cityQuery, [
                city,
                'city',
                parentId
            ])
            let cityId

            if (cityResult.rows.length > 0) {
                cityId = cityResult.rows[0].id
            } else {
                const insertCityQuery =
                    'INSERT INTO location (location_name, parent_id, level) VALUES ($1, $2, $3) RETURNING id'
                cityResult = await client.query(insertCityQuery, [
                    city,
                    parentId,
                    'city'
                ])
                cityId = cityResult.rows[0].id
            }

            // Insert the airport
            const airportQuery =
                'INSERT INTO airport (airport_code, location_id, airport_name, image_url) VALUES ($1, $2, $3, $4) RETURNING *'
            const result = await client.query(airportQuery, [
                airport_code,
                cityId,
                airport_name,
                image_url
            ])

            return result.rows[0]
        })
    },

    /**
     * Fetches all airports from the database
     * the results should contain all fields from the airport table and for the location fields, it should contain country, state, and city
     * get a one airport, then get the location id of that airport then get the locations (city, state, country) of that location id from location table
     * @returns {Promise<Array>} Returns an array of all airports
     */
    getAll: async () => {
        const result = await db.query(`
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

    getById: async id => {
        const result = await db.query(
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

    getAllByLocationId: async locationId => {
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
        const result = await db.query(query, [locationId])
        return result.rows
    },

    updateById: async (id, data) => {
        try {
            return db.transaction(async client => {
                const {
                    airport_code,
                    airport_name,
                    country,
                    state,
                    city,
                    image_url
                } = data

                const locationQuery =
                    'SELECT location_id FROM airport WHERE id = $1'
                const locationId = await client.query(locationQuery, [id])

                if (city) {
                    const cityQuery =
                        'UPDATE location SET location_name = $1 WHERE id = $2 RETURNING parent_id'
                    const cityId = await client.query(cityQuery, [
                        city,
                        locationId.rows[0].location_id
                    ])
                    if (state) {
                        const stateQuery =
                            'UPDATE location SET location_name = $1 WHERE id = $2 RETURNING parent_id'
                        const stateId = await client.query(stateQuery, [
                            state,
                            cityId.rows[0].parent_id
                        ])
                        if (country) {
                            const countryQuery =
                                'UPDATE location SET location_name = $1 WHERE id = $2'
                            await client.query(countryQuery, [
                                country,
                                stateId.rows[0].parent_id
                            ])
                        }
                    } else if (country) {
                        const stateQuery =
                            'SELECT parent_id FROM location WHERE id = $1'
                        const stateId = await client.query(stateQuery, [
                            cityId.rows[0].parent_id
                        ])
                        const countryQuery =
                            'UPDATE location SET location_name = $1 WHERE id = $2'
                        await client.query(countryQuery, [
                            country,
                            stateId.rows[0].parent_id
                        ])
                    }
                } else if (state) {
                    const stateQuery =
                        'UPDATE location SET location_name = $1 WHERE id = $2 RETURNING parent_id'
                    const stateId = await client.query(stateQuery, [
                        state,
                        locationId.rows[0].location_id
                    ])
                    if (country) {
                        const countryQuery =
                            'UPDATE location SET location_name = $1 WHERE id = $2'
                        await client.query(countryQuery, [
                            country,
                            stateId.rows[0].parent_id
                        ])
                    }
                } else if (country) {
                    const countryQuery =
                        'UPDATE location SET location_name = $1 WHERE id = $2'
                    await client.query(countryQuery, [
                        country,
                        locationId.rows[0].location_id
                    ])
                }

                const fields = []
                const values = []
                let query = 'UPDATE airport SET '

                if (airport_code) {
                    fields.push('airport_code')
                    values.push(airport_code)
                }
                if (airport_name) {
                    fields.push('airport_name')
                    values.push(airport_name)
                }
                if (image_url) {
                    fields.push('image_url')
                    values.push(image_url)
                }

                fields.forEach((field, index) => {
                    query += `${field} = $${index + 1}`
                    if (index < fields.length - 1) {
                        query += ', '
                    }
                })

                query += ` WHERE id = $${fields.length + 1} RETURNING *`
                values.push(id)

                const result = await client.query(query, values)

                return result.rows[0]
            })
        } catch (error) {
            console.error('Error updating airport:', error)
            throw error
        }
    },

    deleteById: async id => {
        try {
            return db.transaction(async client => {
                const query = 'DELETE FROM airport WHERE id = $1 RETURNING *'
                const { rows } = await client.query(query, [id])
                return rows[0]
            })
        } catch (error) {
            console.error('Error deleting airport:', error)
            throw error
        }
    }
}
