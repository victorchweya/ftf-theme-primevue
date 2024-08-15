<script setup>
import { ref } from "vue";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
const { errors: storeErrors } = storeToRefs(authStore);
const loading = ref(false);

const schema = yup.object({
	name: yup.string().required("First Name is required"),
	lastName: yup.string().required("Last Name is required"),
	businessName: yup.string().required("Business Name is required"),
	businessCategory: yup.object().required("Business Category is required"),
	email: yup
		.string()
		.required("Email is required")
		.email("Invalid email format"),
	phone: yup.string().required("Phone Number is required"),
	password: yup
		.string()
		.required("Password is required")
		.min(8, "Password must be at least 8 characters"),
	terms: yup
		.boolean()
		.oneOf([true], "You must agree to the terms and conditions"),
});

const { handleSubmit, resetForm, errors } = useForm({
	validationSchema: schema,
	initialValues: {
		terms: false,
	},
});

const { value: firstName, errorMessage: firstNameError } = useField("name");
const { value: lastName, errorMessage: lastNameError } = useField("lastName");
const { value: businessName, errorMessage: businessNameError } =
	useField("businessName");
const { value: businessCategory, errorMessage: businessCategoryError } =
	useField("businessCategory");
const { value: email, errorMessage: emailError } = useField("email");
const { value: phone, errorMessage: phoneError } = useField("phone");
const { value: password, errorMessage: passwordError } = useField("password");
const { value: terms, errorMessage: termsError } = useField("terms");

const category = ref([
	{ category: "School/Feeding Program" },
	{ category: "Hotel/Restaurant" },
	{ category: "Caterer" },
	{ category: "Food Processor" },
	{ category: "Retail" },
	{ category: "FTFF" },
	{ category: "Farm to Feed" },
	{ category: "Other" },
]);

const onSubmit = handleSubmit(async (values) => {
	loading.value = true;
	try {
		const body = {
			name: `${values.name} ${values.lastName}`,
			business: values.businessName,
			category: values.businessCategory.category,
			email: values.email,
			phone: values.phone.toString(),
			password: values.password,
			password_confirmation: values.password,
		};
		await authStore.register(body);
		resetForm();
		router.push("/auth/billing-details");
		toast.add({
			severity: "success",
			summary: "Success",
			detail: "Registration Successful",
			life: 3000,
		});
	} catch (error) {
		toast.add({
			severity: "error",
			summary: "Registration error",
			detail: error.message || "An error occurred during registration",
			life: 5000,
		});
	} finally {
		loading.value = false;
	}
});
</script>

<template>
	<div class="flex min-h-screen m overflow-hidden">
		<div
			class="hidden md:block w-6 bg-no-repeat bg-cover bg-green-50"
			style="
				background: url(../../assets/images/register.png) center center
					no-repeat;
				background-size: cover;
			"
		>
			<div class="w-full p-8 flex flex-column">
				<div class="logo mb-8">
					<RouterLink to="/">
						<img src="../../assets/images/logo.svg" alt="" />
					</RouterLink>
				</div>
				<div
					class="flex align-items-start justify-content-between text-center flex-column"
				>
					<ul
						class="list-none flex flex-column gap-5 lg:flex-column justify-content-between p-0"
					>
						<li
							class="flex align-items-center flex-row gap-3 relative w-full"
						>
							<div
								class="flex justify-content-center align-items-center border-circle bg-primary-100 w-4rem h-4rem z-1"
							>
								<i
									class="pi pi-circle-fill text-xl text-primary-600"
								></i>
							</div>
							<div
								class="w-full hidden lg:hidden absolute right-50 bg-primary-500 hidden"
								style="
									transform: translateY(-50%);
									height: 2px;
									top: 25%;
								"
							></div>
							<div
								class="w-full hidden lg:hiddend absolute left-50 surface-300 hidden"
								style="
									transform: translateY(-50%);
									height: 2px;
									top: 25%;
								"
							></div>
							<div class="flex flex-column align-items-center">
								<div
									class="m-0 font-medium text-900 line-height-3"
								>
									Create Account
								</div>
							</div>
						</li>

						<li
							class="flex align-items-center flex-row gap-3 relative w-full"
						>
							<div
								class="w-full hidden lg:hidden absolute right-50 surface-300 hidden"
								style="
									transform: translateY(-50%);
									height: 2px;
									top: 25%;
								"
							></div>
							<div
								class="flex justify-content-center align-items-center surface-200 border-circle w-4rem h-4rem z-1"
							>
								<i
									class="pi pi-circle-fill text-xl text-600"
								></i>
							</div>
							<div class="flex flex-column align-items-center">
								<div class="m-0 font-medium line-height-3">
									Billing Details
								</div>
							</div>
						</li>
						<li
							class="flex align-items-center flex-row gap-3 relative w-full"
						>
							<div
								class="w-full hidden lg:hidden absolute right-50 surface-300 hidden"
								style="
									transform: translateY(-50%);
									height: 2px;
									top: 25%;
								"
							></div>
							<div
								class="flex justify-content-center align-items-center surface-200 border-circle w-4rem h-4rem z-1"
							>
								<i
									class="pi pi-circle-fill text-xl text-600"
								></i>
							</div>
							<div class="flex flex-column align-items-center">
								<div class="m-0 font-medium line-height-3">
									Delivery Details
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="w-full md:w-6 md:px-8 md:py-0 flex align-items-center">
			<div class="w-full p-4 md:p-8">
				<div class="md:hidden logo mb-8">
					<RouterLink to="/">
						<img src="../../assets/images/logo.svg" alt="" />
					</RouterLink>
				</div>
				<div class="mb-5">
					<h1
						class="text-900 text-5xl font-normal mb-3 text-primary font-serif"
					>
						Register
					</h1>
					<span class="font-normal text-600"
						>Welcome to Farm to Feed! Register to start
						shopping</span
					>
				</div>

				<div v-if="storeErrors" class="mb-5">
					<Message severity="error">{{ storeErrors }}</Message>
				</div>

				<form @submit="onSubmit" class="flex flex-column">
					<div class="formgrid grid">
						<div class="field col-12 md:col-6">
							<label for="firstName">First Name</label>
							<InputText
								id="firstName"
								v-model="firstName"
								:invalid="!!firstNameError"
								placeholder="First Name"
								fluid
							/>
							<small class="p-error">{{
								firstNameError || "&nbsp;"
							}}</small>
						</div>
						<div class="field col-12 md:col-6">
							<label for="lastName">Last Name</label>
							<InputText
								id="lastName"
								v-model="lastName"
								:invalid="!!lastNameError"
								placeholder="Last Name"
								fluid
							/>
							<small class="p-error">{{
								lastNameError || "&nbsp;"
							}}</small>
						</div>
						<div class="field col-12 md:col-6">
							<label for="businessName">Business Name</label>
							<InputText
								id="businessName"
								v-model="businessName"
								:invalid="!!businessNameError"
								placeholder="Business Name"
								fluid
							/>
							<small class="p-error">{{
								businessNameError || "&nbsp;"
							}}</small>
						</div>
						<div class="field col-12 md:col-6">
							<label for="businessCategory"
								>Business Category</label
							>
							<Select
								v-model="businessCategory"
								:options="category"
								optionLabel="category"
								:invalid="!!businessCategoryError"
								placeholder="Business Category"
								fluid
							/>
							<small class="p-error">{{
								businessCategoryError || "&nbsp;"
							}}</small>
						</div>
						<div class="field col-12">
							<label for="email">Email</label>
							<InputText
								id="email"
								v-model="email"
								:invalid="
									!!emailError || !!storeErrors?.errors?.email
								"
								placeholder="Email address"
								fluid
							/>
							<small class="p-error">{{
								emailError || "&nbsp;"
							}}</small>
						</div>
						<div class="field col-12">
							<label for="phone">Phone</label>
							<InputText
								id="phone"
								v-model="phone"
								:invalid="!!phoneError || !!storeErrors?.phone"
								placeholder="Phone Number"
								fluid
							/>
							<small class="p-error">{{
								phoneError || "&nbsp;"
							}}</small>
						</div>
						<div class="field col-12">
							<label for="password">Password</label>
							<Password
								id="password"
								v-model="password"
								:invalid="
									!!passwordError || !!storeErrors?.password
								"
								placeholder="Password"
								:feedback="false"
								toggleMask
								fluid
							/>
							<small class="p-error">{{
								passwordError || "&nbsp;"
							}}</small>
						</div>
						<div class="formgroup-inline col-12 mb-6">
							<div class="field-checkbox">
								<Checkbox
									v-model="terms"
									:invalid="!!errors.terms"
									id="terms"
									binary
								></Checkbox>
								<label for="terms">
									<span class="text-600"
										>By registering you agree to
										FarmToFeed</span
									>
									<RouterLink
										to="/legal/terms-and-conditions"
										class="no-underline text-green-400"
										target="_blank"
									>
										Terms & Conditions
									</RouterLink>
									and
									<RouterLink
										to="/legal/privacy-policy"
										class="no-underline text-green-400"
										target="_blank"
									>
										Privacy Policy
									</RouterLink>
								</label>
							</div>
							<small class="p-error -mt-2">{{
								errors.terms || "&nbsp;"
							}}</small>
						</div>
						<Button
							type="submit"
							label="Register"
							class="w-full"
							rounded
							:disabled="loading"
							:loading="loading"
							size="large"
						></Button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
