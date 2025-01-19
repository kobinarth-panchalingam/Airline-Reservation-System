export const API_ENDPOINTS = {
	// Aircraft Models
	GET_ALL_AIRCRAFT_MODELS: "/aircraft-models",
	CREATE_AIRCRAFT_MODEL: "/aircraft-models",
	UPDATE_AIRCRAFT_MODEL: (id: number) => `/aircraft-models/${id}`,
	DELETE_AIRCRAFT_MODEL: (id: number) => `/aircraft-models/${id}`,
	// Flights
	GET_ALL_FLIGHTS: "/flights",
	CREATE_FLIGHT: "/flights",
	UPDATE_FLIGHT: (id: number) => `/flights/${id}`,
	DELETE_FLIGHT: (id: number) => `/flights/${id}`,
};
