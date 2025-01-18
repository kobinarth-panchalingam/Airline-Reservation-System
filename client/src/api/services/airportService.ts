import { API_ENDPOINTS } from "../apiEndpoints";
import { axiosClient } from "../axiosClient";

export interface Airport {
	id: number;
	airport_name: string;
	airport_code: string;
	city: string;
	state: string;
	country: string;
}

export const getAllAirports = async () => {
	const { data } = await axiosClient.get<Array<Airport>>(
		API_ENDPOINTS.GET_ALL_AIRPORTS
	);
	return data;
};

export const getAirportsByLocation = async (location_id: number) => {
	const { data } = await axiosClient.get<Array<Airport>>(
		API_ENDPOINTS.GET_ALL_AIRPORTS_BY_LOCATION(location_id)
	);
	return data;
};

export const updateAirport = async (values: Airport) => {
	const { data } = await axiosClient.put<Airport>(
		API_ENDPOINTS.UPDATE_AIRPORT(values.airport_code),
		values
	);
	return data;
};

export const createAirport = async (values: Airport) => {
	const { data } = await axiosClient.post<Airport>(
		API_ENDPOINTS.CREATE_AIRPORT,
		values
	);
	return data;
};

export const deleteAirport = async (airport_code: string) => {
	const { data } = await axiosClient.delete<Airport>(
		API_ENDPOINTS.DELETE_AIRPORT(airport_code)
	);
	return data;
};
