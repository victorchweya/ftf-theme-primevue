import { defineStore } from "pinia";
import router from "../router";
import { fetchWrapper } from "../helpers";

const baseUrl = import.meta.env.VITE_API_URL;

export const useShoppingStore = defineStore({
	id: "shoppingStore",
	state: () => ({
		crops: [],
		crop: [],
		orders: [],
		favouritesIds: [],
		favourites: [],
		invoices: [],
		collectionSources: [],
		farmerOrders: [],
		status: {},
		singleOrder: {},
		newOrder: false,
		// Load cart items from local storage
		cartItems: JSON.parse(localStorage.getItem("cartItems1.1"))
			? JSON.parse(localStorage.getItem("cartItems1.1"))
			: [],
		// Load recurring dates from local storage
		recurringDates: JSON.parse(localStorage.getItem("recurringDates"))
			? JSON.parse(localStorage.getItem("recurringDates"))
			: [],

		loading: {},
		cropLoading: false,
		error: null,
		showRescue: false,
		showGrade1_2: false,
	}),
	getters: {
		countCartItems: (state) => state.cartItems.length,
		isCartEmpty: (state) => state.countCartItems === 0,
		getCartItems(state) {
			//access cart items
			return state.cartItems;
		},
		getCropsByCategory: (state) => {
			return (category) => {
				if (category === "All") {
					return state.crops;
				}
				return state.crops.filter((crop) => crop.category === category);
			};
		},
		// getCropsByFavourite: (state) => {
		// 	return (favouriteIds) => {
		// 		return state.crops.filter((crop) =>
		// 			favouriteIds.includes(crop.crop[0].id)
		// 		);
		// 	};
		// },

		getFavouriteCrops: (state) => {
			return state.crops.filter((crop) => {
				return state.favouritesIds.includes(crop.id);
			});
		},
	},
	actions: {
		async fetchCrops() {
			this.cropLoading = true;
			try {
				const user = JSON.parse(localStorage.getItem("user"));

				const isLoggedIn = !!user && !!user.token;
				//use differnt endpoint if user is logged in
				const endpoint = isLoggedIn
					? baseUrl + "/protected/crops"
					: baseUrl + "/crops";

				// const response = await fetchWrapper.get(endpoint);
				const [crops, favourites] = await Promise.all([
					fetchWrapper.get(endpoint),
					this.fetchFavourites(), // fetch favourites
				]);
				// console.log(crops[0]);
				this.crops = crops.map((crop) => ({
					...crop,
					//if custom pricing exist update selling price to customer pricing
					sellingPriceFtf: crop.customerPricing
						? crop.customerPricing
						: crop.sellingPriceFtf,
					quantity: 1, //add quantity to crop, to be used when adding to cart on crop list
					favourite: favourites?.some(
						(favourite) => favourite?.product[0]?.id === crop.id
					), // Update favourite property
					selectedUnit: crop.cropPricing[0], // set default pricing unit for the crop
					selectedProcess: { process: "None" }, // add process to crop, to be used when adding to cart on crop list
				}));
				// console.log(this.crops[0]);

				//sort alphabeticaly by crop name
				this.crops.sort((a, b) => {
					const productA = a.crop[0].product;
					const productB = b.crop[0].product;

					return productA.localeCompare(productB);
				});
				// console.log(this.crops);
			} catch (error) {
				this.error = error;
			} finally {
				this.cropLoading = false;
			}
		},
		async fetchCrop(id) {
			this.loading["crop"] = true;
			try {
				const user = JSON.parse(localStorage.getItem("user"));

				const isLoggedIn = !!user && !!user.token;
				//use differnt endpoint if user is logged in
				const endpoint = isLoggedIn
					? baseUrl + `/protected/crops/${id}`
					: baseUrl + `/crops/${id}`;
				const response = await fetchWrapper.get(endpoint);

				this.crop = response[0];
				this.crop.selectedUnit = this.crop.cropPricing[0];
				this.crop.selectedProcess = { process: "None" };
				//if custom pricing exist update selling price to customer pricing
				if (this.crop.customerPricing !== undefined) {
					this.crop.sellingPriceFtf = this.crop.customerPricing;
				}
				// console.log(this.crop);
			} catch (error) {
				this.error = error;
			} finally {
				this.loading["crop"] = false;
			}
		},

		addToCart(item, quantity, process, unit, price) {
			// Resetting the status object
			this.status = {
				updated: null,
				added: null,
			};

			const index = this.cartItems.findIndex(
				(product) =>
					product.id === item.id &&
					product.unit === unit &&
					product.process === process
			);

			if (index !== -1) {
				// If the item exists, update its quantity
				this.cartItems[index].quantity += quantity;
				this.status["updated"] = "updated";
			} else {
				// Create a new object with the properties of item, but with the updated quantity  this avoids mutating quantity in the component
				const newItem = {
					...item,
					quantity: quantity,
					process: process,
					unit: unit,
					price: price,
				};
				this.cartItems.push(newItem);
				this.status["added"] = "added";

				// Save cart items to local storage
				localStorage.setItem(
					"cartItems1.1",
					JSON.stringify(this.cartItems)
				);
			}
			// Save cart items to local storage (outside the if-else block to avoid redundancy)
			localStorage.setItem(
				"cartItems1.1",
				JSON.stringify(this.cartItems)
			);
		},
		removeFromCart(item, unit, process) {
			this.cartItems = this.cartItems.filter(
				(product) =>
					product.id !== item.id ||
					product.unit !== unit ||
					product.process !== process
			);
			this.status["removed"] = "removed";
			localStorage.setItem(
				"cartItems1.1",
				JSON.stringify(this.cartItems)
			);
		},

		updateCart() {
			localStorage.setItem(
				"cartItems1.1",
				JSON.stringify(this.cartItems)
			);
			// console.log("Your cart has been updated");
		},
		//post new order
		async postOrder(body) {
			this.loading["postOrder"] = true;

			try {
				const response = await fetchWrapper.post(
					`${baseUrl}/orders`,
					body
				);
				this.cartItems = [];
				localStorage.removeItem("cartItems1.1");
				this.recurringDates = [];
				localStorage.removeItem("recurringDates");

				router.push({
					name: "orders",
				});

				// router.push(`/order/${response.data.id}`); // redirect to single order that has been created
				return response;
			} catch (error) {
				console.error(error);
				throw error;
			} finally {
				this.loading["postOrder"] = false;
				this.newOrder = true;
			}
		},
		async fetchOrders() {
			this.loading["orders"] = true;
			try {
				const response = await fetchWrapper.get(baseUrl + "/orders");

				this.orders = response;
			} catch (error) {
				console.error(error);
				throw error;
			} finally {
				this.loading["orders"] = false;
			}
		},
		async fetchOrder(id) {
			this.loading["order"] = true;

			try {
				const response = await fetchWrapper.get(
					baseUrl + `/orders/${id}`
				);
				this.singleOrder = response;
			} catch (error) {
				console.error(error);
				throw error;
			} finally {
				this.loading["order"] = false;
			}
		},
		async cancelOrder(id, body) {
			this.loading["cancelOrder"] = true;
			try {
				const response = await fetchWrapper.post(
					baseUrl + `/orders/cancel/${id}`,
					body
				);
				return response;
			} catch (error) {
				console.error("Error cancelling order:", error);
				throw error;
			} finally {
				this.loading["cancelOrder"] = false;
			}
		},
		async fetchFavourites() {
			this.loading["favourites"] = true;
			try {
				const response = await fetchWrapper.get(baseUrl + "/wishlist");
				//get only the ids
				this.favouritesIds = response.flatMap((item) =>
					item.product.map((item) => item.id)
				);
				// console.log(this.favouritesIds);
				this.favourites = response;
				return response;
			} catch (error) {
				console.error(error);
				throw error;
			} finally {
				this.loading["favourites"] = false;
			}
		},
		async addFavourite(id) {
			this.loading["favourite"] = true;
			// console.log(this.favouritesIds);
			this.favouritesIds.push(id);

			try {
				const response = await fetchWrapper.get(
					baseUrl + `/wishlist/${id}`
				);
				return response;
			} catch (error) {
				console.error(error);
				throw error;
			} finally {
				this.loading["favourite"] = false;
			}
		},

		async deleteFavourite(id) {
			this.loading["delfavourite"] = true;
			//use the crop id to get the id for the favourite id used for deletion
			const filteredIds = this.favourites
				.filter((item) => item.product[0].id === id)
				.map((item) => ({
					itemId: item.id,
					productId: item.product[0].id,
				}));
			console.log(filteredIds);
			console.log(this.favouritesIds);
			//get index of item to remove to remove from array of favouriteIDs
			const index = this.favouritesIds.indexOf(filteredIds[0].productId);
			if (index !== -1) {
				this.favouritesIds.splice(index, 1);
			}
			try {
				const response = await fetchWrapper.delete(
					baseUrl + `/wishlist/${filteredIds[0].itemId}`
				);
				return response;
			} catch (error) {
				console.error(error);
				throw error;
			} finally {
				this.loading["delfavourite"] = false;
			}
		},

		async fetchInvoices() {
			this.loading["invoices"] = true;
			try {
				const response = await fetchWrapper.get(baseUrl + "/invoices");
				this.invoices = response;
			} catch (error) {
				console.error(error);
				throw error;
			} finally {
				this.loading["invoices"] = false;
			}
		},
		async postCustomerFeedback(id, body) {
			this.loading["feedback"] = true;
			try {
				const response = await fetchWrapper.post(
					baseUrl + `/feedback/${id}`,
					body
				);
				return response;
			} catch (error) {
				console.error("Error posting feedback:", error);
				throw error;
			} finally {
				this.loading["feedback"] = false;
			}
		},
		recurringOrders(dates) {
			localStorage.setItem("recurringDates", JSON.stringify(dates));
			// console.log(dates);
		},

		async fetchCollectionSources() {
			this.loading["sources"] = true;
			try {
				const response = await fetchWrapper.get(
					baseUrl + "/admin/collection-sources"
				);
				this.collectionSources = response;
			} catch (error) {
				console.error(error);
				throw error;
			} finally {
				this.loading["sources"] = false;
			}
		},
		async postPurchaseOrder(body) {
			this.loading["raisePurchaseOrder"] = true;
			try {
				const response = await fetchWrapper.post(
					baseUrl + `/admin/farmer-orders`,
					body
				);
				return response;
			} catch (error) {
				console.error("Error posting order:", error);
				throw error;
			} finally {
				this.loading["raisePurchaseOrder"] = false;
			}
		},
		async fetchPurchaseOrders() {
			this.loading["purchaseOrders"] = true;
			try {
				const response = await fetchWrapper.get(
					baseUrl + "/admin/farmer-orders"
				);
				this.farmerOrders = response;
			} catch (error) {
				console.error(error);
				throw error;
			} finally {
				this.loading["purchaseOrders"] = false;
			}
		},
	},
});
