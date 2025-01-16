export const API_ENDPOINTS = {
	GET_ALL_AIRCRAFT_MODELS: "/aircraft-models",
	CREATE_AIRCRAFT_MODEL: "/aircraft-models",
	UPDATE_AIRCRAFT_MODEL: (id: number) => `/aircraft-models/${id}`,
	DELETE_AIRCRAFT_MODEL: (id: number) => `/aircraft-models/${id}`,
};
