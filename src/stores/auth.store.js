// store/authStore.js

import { defineStore } from "pinia";
import router from "../router";
import { authApi } from "../api/authApi";

export const useAuthStore = defineStore("auth", {
	state: () => ({
		user: JSON.parse(localStorage.getItem("user")) || null,
		returnUrl: null,
		loading: {},
		errors: null,
		addresses: [],
		customerDetails: [],
		billingDetails: null,
	}),

	getters: {
		isFTFstaff: (state) => {
			return state.user?.details.hasOwnProperty("User Type");
		},
	},

	actions: {
		async login(email, password) {
			try {
				const user = await authApi.login(email, password);
				this.user = user?.data;
				localStorage.setItem("user", JSON.stringify(this.user));
				await this.fetchCustomerDetails();

				if (
					this.billingDetails &&
					this.billingDetails.Active === true
				) {
					localStorage.setItem("active", true);
					router.push(this.returnUrl || "/All");
				} else {
					localStorage.setItem("active", false);
					router.push("/account/access-denied");
				}
			} catch (error) {
				throw error;
			}
		},

		async logout() {
			try {
				await authApi.logout();
			} catch (error) {
				this.errors = error;
			} finally {
				this.user = null;
				localStorage.removeItem("user");
				localStorage.removeItem("active");
				router.push("/auth/login");
			}
		},

		async register(body) {
			this.loading["register"] = true;
			try {
				const response = await authApi.register(body);
				this.user = response?.data;
				localStorage.setItem("user", JSON.stringify(this.user));
				await router.push("/account/billing-details");
			} catch (error) {
				this.errors = error;
			} finally {
				this.loading["register"] = false;
			}
		},

		async updateCustomerDetails(body) {
			try {
				return await authApi.updateCustomerDetails(body);
			} catch (error) {
				console.error("Error updating customer details:", error);
				let userFriendlyError =
					"Something went wrong. Please try again later.";
				if (error.response && error.response.status === 400) {
					userFriendlyError = "Bad request. Please check your input.";
				} else if (error.response && error.response.status === 404) {
					userFriendlyError = "Customer Profile not found.";
				}
				throw new Error(userFriendlyError);
			}
		},

		async sendPasswordResetLink(body) {
			await authApi.sendPasswordResetLink(body);
		},

		async resetPassword(body) {
			await authApi.resetPassword(body);
		},

		async updatePassword(body) {
			await authApi.updatePassword(body);
		},

		async updateBillingDetails(body) {
			await authApi.updateBillingDetails(body);
		},

		async createDeliveryAddress(body) {
			this.loading["createDeliveryAddress"] = true;
			try {
				return await authApi.createDeliveryAddress(body);
			} catch (error) {
				this.errors = error;
			} finally {
				this.loading["createDeliveryAddress"] = false;
			}
		},

		async fetchAddresses() {
			this.loading["DeliveryAddress"] = true;
			try {
				this.addresses = await authApi.fetchAddresses();
			} catch (error) {
				this.errors = error;
			} finally {
				this.loading["DeliveryAddress"] = false;
			}
		},

		async makeAddressDefault(id) {
			this.loading["makeAddressDefault"] = true;
			try {
				return await authApi.makeAddressDefault(id);
			} catch (error) {
				throw error;
			} finally {
				this.loading["makeAddressDefault"] = false;
			}
		},

		async updateDeliveryAddress(id, body) {
			this.loading["updateDeliveryAddress"] = true;
			try {
				return await authApi.updateDeliveryAddress(id, body);
			} catch (error) {
				throw error;
			} finally {
				this.loading["updateDeliveryAddress"] = false;
			}
		},

		async deleteDeliveryAddress(id) {
			this.loading["deleteDeliveryAddress"] = true;
			try {
				return await authApi.deleteDeliveryAddress(id);
			} catch (error) {
				throw error;
			} finally {
				this.loading["deleteDeliveryAddress"] = false;
			}
		},

		async fetchCustomerDetails() {
			this.loading["CustomerDetails"] = true;
			try {
				this.customerDetails = await authApi.fetchCustomerDetails();
				this.billingDetails = this.customerDetails.airtable;
			} catch (error) {
				this.errors = error;
			} finally {
				this.loading["CustomerDetails"] = false;
			}
		},
	},
});
