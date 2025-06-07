import type { AxiosInstance } from "axios";
import axios from "axios";

import { get_session } from "./auth/action";

axios.defaults.withCredentials = true;

const axiosInstance: AxiosInstance = axios.create({
	baseURL: process.env.DJANGO_API_BASE_URL, // Default baseURL for non-tenant requests
	timeout: 20000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Add a request interceptor to handle session-based subdomains
axiosInstance.interceptors.request.use(
	async (config) => {
		// Handle session authorization
		if (config.data instanceof FormData) {
			// Let Axios handle Content-Type for FormData
			delete config.headers["Content-Type"];
		}
		if (
			!config.url?.includes("auth/login/") &&
			!config.url?.includes("auth/signup/") &&
			!config.url?.includes("auth/forgot-password/") &&
			!config.url?.includes("auth/verify-otp/") &&
			!config.url?.includes("auth/reset-password/")
		) {
			const session = await get_session();
			const sessionId = session?.sessionId;

			if (sessionId) {
				config.headers.Authorization = `Session ${sessionId}`;
			}
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default axiosInstance;
