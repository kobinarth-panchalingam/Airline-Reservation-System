import { API_ENDPOINTS } from "../apiEndpoints";
import { axiosClient } from "../axiosClient";

export interface AircraftModel {
	id: number;
	model_name: string;
	variant: string;
	manufacturer_name: string;
	seating_capacity: number;
	max_load: number;
	fuel_capacity: number;
	average_speed: number;
}

export const getAllAircraftModels = async () => {
	const { data } = await axiosClient.get<Array<AircraftModel>>(
		API_ENDPOINTS.GET_ALL_AIRCRAFT_MODELS
	);
	return data;
};

export const updateAircraftModel = async (values: AircraftModel) => {
	const { data } = await axiosClient.put<AircraftModel>(
		API_ENDPOINTS.UPDATE_AIRCRAFT_MODEL(values.id),
		values
	);
	return data;
};

export const createAircraftModel = async (values: AircraftModel) => {
	const { data } = await axiosClient.post<AircraftModel>(
		API_ENDPOINTS.CREATE_AIRCRAFT_MODEL,
		values
	);
	return data;
};

export const deleteAircraftModel = async (id: number) => {
	const { data } = await axiosClient.delete<AircraftModel>(
		API_ENDPOINTS.DELETE_AIRCRAFT_MODEL(id)
	);
	return data;
};
