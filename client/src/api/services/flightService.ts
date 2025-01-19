import { API_ENDPOINTS } from "../apiEndpoints";
import { axiosClient } from "../axiosClient";

export interface Flight {
	id: number;
	airplane_id: number;
	route_id: number;
	departure_time: string;
	arrival_time: string;
	flight_status: string;
}

export const getAllFlights = async () => {
	const { data } = await axiosClient.get<Array<Flight>>(
		API_ENDPOINTS.GET_ALL_FLIGHTS
	);
	return data;
};

export const updateFlight = async (values: Flight) => {
	const { data } = await axiosClient.put<Flight>(
		API_ENDPOINTS.UPDATE_FLIGHT(values.id),
		values
	);
	return data;
};

export const createFlight = async (values: Flight) => {
	const { data } = await axiosClient.post<Flight>(
		API_ENDPOINTS.CREATE_FLIGHT,
		values
	);
	return data;
};

export const deleteFlight = async (id: number) => {
	const { data } = await axiosClient.delete<Flight>(
		API_ENDPOINTS.DELETE_FLIGHT(id)
	);
	return data;
};
