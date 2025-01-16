import axios, { type AxiosError } from "axios";
import { notifications } from "@mantine/notifications";

export const axiosClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request Interceptor
// axiosClient.interceptors.request.use(
// 	(config) => {
// 		const token = localStorage.getItem("authToken");
// 		if (token) {
// 			config.headers.Authorization = `Bearer ${token}`;
// 		}
// 		return config;
// 	},
// 	(error) => Promise.reject(error)
// );

// Response Interceptor

axiosClient.interceptors.response.use(
	(response) => {
		const method = response.config.method?.toUpperCase();
		if (method && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
			notifications.show({
				message: "Operation completed successfully",
				color: "green",
				position: "top-right",
			});
		}
		return response;
	},
	(error: AxiosError) => {
		const method = error.config?.method?.toUpperCase();
		if (method && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
			notifications.show({
				message: error.message,
				color: "red",
				position: "top-right",
			});
		}
		// if (error.response?.status === 401) {
		// 	// Handle unauthorized errors (e.g., logout)
		// 	console.error("Unauthorized. Redirecting to login...");
		// }
		return Promise.reject(error);
	}
);
