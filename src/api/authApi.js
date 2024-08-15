// api/authApi.js

import { fetchWrapper } from "../helpers";

const baseUrl = import.meta.env.VITE_API_URL;

export const authApi = {
	login: async (email, password) => {
		return await fetchWrapper.post(`${baseUrl}/auth/login`, {
			email,
			password,
		});
	},
	logout: async () => {
		return await fetchWrapper.get(`${baseUrl}/auth/logout`);
	},
	register: async (body) => {
		return await fetchWrapper.post(`${baseUrl}/auth/register`, body);
	},
	updateCustomerDetails: async (body) => {
		return await fetchWrapper.patch(
			`${baseUrl}/customer/update-profile`,
			body
		);
	},
	sendPasswordResetLink: async (body) => {
		return await fetchWrapper.post(
			`${baseUrl}/auth/send-password-reset-link`,
			body
		);
	},
	resetPassword: async (body) => {
		return await fetchWrapper.post(`${baseUrl}/auth/reset-password`, body);
	},
	updatePassword: async (body) => {
		return await fetchWrapper.patch(
			`${baseUrl}/customer/update-password`,
			body
		);
	},
	updateBillingDetails: async (body) => {
		return await fetchWrapper.patch(
			`${baseUrl}/customer/update-billing-address`,
			body
		);
	},
	createDeliveryAddress: async (body) => {
		return await fetchWrapper.post(`${baseUrl}/delivery/address`, body);
	},
	fetchAddresses: async () => {
		return await fetchWrapper.get(`${baseUrl}/delivery/address`);
	},
	makeAddressDefault: async (id) => {
		return await fetchWrapper.get(
			`${baseUrl}/delivery/address/default/${id}`
		);
	},
	updateDeliveryAddress: async (id, body) => {
		return await fetchWrapper.patch(
			`${baseUrl}/delivery/address/${id}`,
			body
		);
	},
	deleteDeliveryAddress: async (id) => {
		return await fetchWrapper.delete(`${baseUrl}/delivery/address/${id}`);
	},
	fetchCustomerDetails: async () => {
		return await fetchWrapper.get(`${baseUrl}/customer`);
	},
};
