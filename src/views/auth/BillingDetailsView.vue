<script setup>
import { useField, useForm } from "vee-validate";
import { useAuthStore } from "../../stores";
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
const { handleSubmit, resetForm, isSubmitting } = useForm();

const toast = useToast();

const router = useRouter();

const authStore = useAuthStore();

const { loading } = storeToRefs(authStore);

const { value: businessName, errorMessage: businessNameError } = useField(
	"businessName",
	validateBusinessName
);

const { value: address, errorMessage: addressError } = useField(
	"address",
	validateAddress
);

const { value: city, errorMessage: cityError } = useField("city", validateCity);

const { value: kraPin } = useField("kraPin");

function validateBusinessName(value) {
	if (!value) {
		return "Business Name is required.";
	}
	return true;
}

function validateAddress(value) {
	if (!value) {
		return "Address is required.";
	}
	return true;
}

function validateCity(value) {
	if (!value) {
		return "City is required.";
	}
	return true;
}

const onSubmit = handleSubmit(async (values) => {
	let body = {
		completeaddress: [
			values.businessName || "",
			values.address || "",
			values.city || "",
		].join(" "),
		pin: values.kraPin || null,
	};
	try {
		await authStore.updateBillingDetails(body);
		// await console.log(body);
		router.push("/account/delivery-address");
	} catch (error) {
		console.log(error);
	}
});
const saveAndShop = handleSubmit(async (values) => {
	let body = {
		completeaddress: [
			values.businessName || "",
			values.address || "",
			values.city || "",
		].join(" "),
		pin: values.kraPin || null,
	};
	try {
		await authStore.updateBillingDetails(body);

		// await console.log(body);
		router.push("/account/login");
		toast.add({
			severity: "success",
			summary: "Account Created Successfuly!",
			detail: "Your account was created and will be verifed by our sales team before you can shop",
			// life: 5000,
		});
	} catch (error) {
		toast.add({
			severity: "error",
			summary: "Registration Error",
			detail: `${error} Contact administrator`,
			// life: 5000,
		});
		console.error(error);
	}
});

const onUpload = (event) => {
	console.log(event);
};
</script>
<template>
	<div class="flex min-h-screen overflow-hidden">
		<div
			class="hidden md:block w-6 bg-no-repeat bg-cover"
			style="
				background: url(../images/billing-details.png) center center
					no-repeat;
				background-size: cover;
			"
		>
			<div class="w-full p-8">
				<div class="logo">
					<RouterLink to="/">
						<img src="/logo.svg" alt=""
					/></RouterLink>
				</div>
				<div
					class="flex align-items-start justify-content-center text-center mt-8 flex-column"
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
									class="pi pi-check text-xl text-primary-600"
								></i>
							</div>
							<div
								class="w-full hidden lg:hidden absolute left-0 bg-primary-500 hidden"
								style="
									transform: translateX(-50%);
									height: 2px;
									top: 25%;
									transform: rotate(90deg);
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
				<div class="footer"></div>
			</div>
		</div>
		<div class="w-full md:w-6 p-0 md:p-8 flex align-items-center">
			<div class="w-full p-4 md:p-8">
				<div class="mb-5">
					<div class="md:hidden logo mb-8">
						<RouterLink to="/">
							<img src="/logo.svg" alt=""
						/></RouterLink>
					</div>
					<h1 class="text-900 text-5xl font-normal mb-3 text-primary">
						Billing Details
					</h1>
					<span class="font-normal" style="color: #808080"
						>Please provide the following information to ensure a
						smooth and timely processing of your order.
					</span>
				</div>

				<form @submit="onSubmit" class="flex flex-column gap-1">
					<div class="field">
						<label for="email1">Name</label>
						<InputText
							id="businessName"
							type="text"
							placeholder="Business Name"
							class="w-full p-3"
							v-model="businessName"
							:class="{ 'p-invalid': businessNameError }"
						/>
						<small class="p-error" id="email-error">{{
							businessNameError
						}}</small>
					</div>
					<div class="field">
						<label for="address">Address(P.O BOX, C/O)</label>
						<InputText
							id="address"
							type="text"
							placeholder="Address"
							class="w-full p-3"
							v-model="address"
							:class="{ 'p-invalid': addressError }"
						/>
						<small class="p-error" id="email-error">{{
							addressError
						}}</small>
					</div>
					<div class="field">
						<label for="city">City</label>
						<InputText
							id="city"
							type="text"
							placeholder="City"
							class="w-full p-3"
							v-model="city"
							:class="{ 'p-invalid': cityError }"
						/>
						<small class="p-error" id="email-error">{{
							cityError
						}}</small>
					</div>

					<div class="formgrid grid">
						<div class="field col-7">
							<label for="kraPin">Enter KRA Pin</label>
							<InputText
								id="kraPin"
								type="text"
								placeholder="KRA
							Pin (optional)"
								v-model="kraPin"
							/>
						</div>
						<div
							class="field col flex align-items-end justify-content-end"
						>
							<FileUpload
								mode="basic"
								name="kraCert[]"
								url="./upload"
								accept="image/*"
								:maxFileSize="1000000"
								@upload="onUpload"
								:auto="true"
								chooseLabel="Upload KRA Pin"
								class="w-full p-3 p-button-outlined px-4"
								style="
									border: 1px solid #85a687;
									border-radius: 2rem;
								"
								outlined
							/>
						</div>
					</div>
					<div class="flex justify-content-between mt-5">
						<Button
							type="button"
							@click="saveAndShop"
							label="Save & create account"
							class="p-3 text-xl px-4"
							:loading="isSubmitting"
							:disabled="isSubmitting"
							rounded
							outlined
						></Button>

						<Button
							:loading="isSubmitting"
							:disabled="isSubmitting"
							type="submit"
							label="Continue"
							class="p-3 px-4 text-xl"
							rounded
						></Button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
