export const API_ENDPOINTS = {
	// Aircraft Models
	GET_ALL_AIRCRAFT_MODELS: "/aircraft-models",
	CREATE_AIRCRAFT_MODEL: "/aircraft-models",
	UPDATE_AIRCRAFT_MODEL: (id: number) => `/aircraft-models/${id}`,
	DELETE_AIRCRAFT_MODEL: (id: number) => `/aircraft-models/${id}`,

	// Airports
	GET_ALL_AIRPORTS: "/airports",
	GET_ALL_AIRPORTS_BY_LOCATION: (location_id: number) => `/airports/location/${location_id}`,
	CREATE_AIRPORT: "/airports",
	UPDATE_AIRPORT: (code: string) => `/airports/${code}`,
	DELETE_AIRPORT: (id: number) => `/airports/${id}`,
};
