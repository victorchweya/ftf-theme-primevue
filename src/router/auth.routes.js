import {
	Layout,
	Login,
	Register,
	ForgotPassword,
	PasswordReset,
	BillingDetails,
	DeliveryAddress,
	Access,
} from "../views/auth";

export default {
	path: "/auth",
	name: "auth",
	component: Layout,
	meta: {
		hideNavbar: true,
	},
	children: [
		{ path: "", name: "empty", redirect: "login" },
		{ path: "login", name: "login", component: Login },
		{ path: "register", name: "register", component: Register },
		{
			path: "billing-details",
			name: "billingDetails",
			component: BillingDetails,
		},
		{
			path: "delivery-address",
			name: "deliveryAddress",
			component: DeliveryAddress,
		},
		{
			path: "forgot-password",
			name: "forgotPassword",
			component: ForgotPassword,
		},
		{
			path: "password-reset",
			name: "passwordReset",
			component: PasswordReset,
			props: (route) => ({
				token: route.query.token,
				email: route.query.email,
			}),
		},
		{
			path: "access-denied",
			name: "accessDenied",
			component: Access,
		},
	],
};
