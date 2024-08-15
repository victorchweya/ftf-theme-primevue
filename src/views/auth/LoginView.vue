<script setup>
import { ref } from "vue";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { useAuthStore } from "@/stores/auth.store";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const authStore = useAuthStore();
const loading = ref(false);

const schema = yup.object({
	email: yup
		.string()
		.required("Email is required")
		.email("Invalid email format"),
	password: yup.string().required("Password is required"),
});

const { handleSubmit, resetForm } = useForm({
	validationSchema: schema,
});

const { value: email, errorMessage: emailError } = useField("email");
const { value: password, errorMessage: passwordError } = useField("password");

const features = ref([
	{
		title: "Convenient",
		description:
			"Personalised customer care and flexible delivery options.",
	},
	{
		title: "Affordable",
		description: "Quality vegetables that improve your profits.",
	},
	{
		title: "Sustainable",
		description:
			"Produce that creates resilient food systems and prevents food loss.",
	},
]);

const onSubmit = handleSubmit(async (values) => {
	loading.value = true;
	try {
		await authStore.login(values.email, values.password);
		resetForm();
	} catch (error) {
		toast.add({
			severity: "error",
			summary: "Sign-in error",
			detail: error,
			life: 3000,
		});
	} finally {
		loading.value = false;
	}
});
</script>

<template>
	<div class="flex min-h-screen">
		<div class="hidden md:block w-6 bg-no-repeat bg-cover bg-primary">
			<div class="w-full h-full p-8 flex flex-column">
				<div class="logo">
					<RouterLink to="/"></RouterLink>
				</div>

				<div
					class="flex h-full flex-column align-items-center justify-content-center text-center"
				>
					<Carousel
						:value="features"
						:numVisible="1"
						:numScroll="1"
						:showIndicators="false"
						circular
						:autoplayInterval="3000"
						class="w-8"
					>
						<template #item="slotProps">
							<div class="text-center w-full">
								<svg
									width="104"
									height="104"
									viewBox="0 0 104 104"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M8.07409 80.9135C18.9217 100.052 39.0019 106.179 59.6414 103.342C69.2829 103.537 77.3059 96.1353 85.8952 92.4622C109.443 81.6522 103.885 49.4279 97.4315 29.3134C90.5272 9.99338 55.3554 -2.26631 36.4289 0.350811C29.2484 1.67854 22.2183 5.66171 16.2229 9.19535C10.8218 14.0219 8.85017 22.3785 4.60271 28.3376C5.50464 30.4982 2.34089 35.7708 2.38983 39.1058C0.204923 53.3274 -0.490756 68.2809 8.07058 80.9169L8.07409 80.9135Z"
										fill="#E9DCEB"
									/>
									<path
										d="M61.5234 42.9757H57.7608V41.5647C57.7608 39.7587 56.2746 38.2725 54.4685 38.2725H37.0667C35.2606 38.2725 33.7744 39.7587 33.7744 41.5647V58.4963C33.7744 60.3023 35.2606 61.7885 37.0667 61.7885H37.5934C37.838 64.9303 40.453 67.4324 43.6512 67.4324C46.8493 67.4324 49.4643 64.9303 49.7089 61.7885H52.6249C52.8695 64.9303 55.4844 67.4324 58.6826 67.4324C61.8808 67.4324 64.4958 64.9303 64.7404 61.7885H65.2671C67.0732 61.7885 68.5594 60.3023 68.5594 58.4963V50.0305C68.5594 46.1362 65.3988 42.9757 61.5045 42.9757H61.5234ZM36.5963 58.4963V41.5647C36.5963 41.3013 36.8033 41.0944 37.0667 41.0944H54.4685C54.7319 41.0944 54.9389 41.3013 54.9389 41.5647V56.5021C54.9389 56.5021 54.8448 56.615 54.7884 56.6526C54.5062 56.8972 54.2428 57.1606 53.9982 57.4427C53.923 57.5368 53.8477 57.6121 53.7913 57.7061C53.5091 58.1012 53.2457 58.4963 53.0764 58.9478H49.3138C49.3138 58.9478 49.3138 58.9478 49.3138 58.929C49.1821 58.6091 48.994 58.2893 48.8059 58.0071C48.7494 57.9319 48.693 57.8566 48.6366 57.7626C48.4861 57.5368 48.3167 57.3487 48.1286 57.1417C48.0534 57.0665 47.9969 56.9912 47.9217 56.916C47.6771 56.6902 47.4325 56.4833 47.1692 56.2952C47.1315 56.2764 47.1127 56.2387 47.0751 56.2199C46.7929 56.0318 46.4919 55.8813 46.1909 55.7308C46.078 55.6743 45.9651 55.6367 45.8523 55.5991C45.6077 55.505 45.3819 55.4298 45.1374 55.3733C45.0245 55.3545 44.9116 55.3169 44.7987 55.2981C44.4413 55.2228 44.065 55.1852 43.6888 55.1852C43.3125 55.1852 42.9551 55.2228 42.5788 55.2981C42.4659 55.3169 42.3531 55.3545 42.2402 55.3733C41.9956 55.4298 41.7511 55.505 41.5253 55.5991C41.4124 55.6367 41.2996 55.6743 41.1867 55.7308C40.8857 55.8625 40.5847 56.0318 40.3025 56.2199C40.2648 56.2387 40.246 56.2575 40.2084 56.2952C39.945 56.4833 39.6816 56.6902 39.4559 56.916C39.3806 56.9912 39.3054 57.0665 39.249 57.1417C39.0608 57.3299 38.8915 57.5368 38.741 57.7626C38.6846 57.8378 38.6281 57.9131 38.5717 58.0071C38.3836 58.3081 38.2142 58.6091 38.0637 58.929V58.9478H37.1231C36.8597 58.9478 36.6528 58.7408 36.6528 58.4775L36.5963 58.4963ZM43.6512 64.6104C41.8451 64.6104 40.3589 63.1242 40.3589 61.3182C40.3589 61.0924 40.3777 60.8667 40.4342 60.6597C40.5094 60.3211 40.6411 60.0013 40.8104 59.7191C40.8292 59.6627 40.8669 59.625 40.8857 59.5686C41.055 59.3052 41.2619 59.0607 41.5065 58.8537C41.5629 58.8161 41.6006 58.7785 41.657 58.7408C41.9016 58.5527 42.1838 58.3834 42.4848 58.2705C42.5224 58.2705 42.5788 58.2329 42.6353 58.2329C42.9551 58.12 43.3125 58.0448 43.67 58.0448C44.0274 58.0448 44.366 58.12 44.7047 58.2329C44.7611 58.2329 44.7987 58.2517 44.8552 58.2705C45.1562 58.3834 45.4384 58.5527 45.6829 58.7408C45.7394 58.7785 45.777 58.8161 45.8334 58.8537C46.078 59.0607 46.285 59.3052 46.4543 59.5686C46.4919 59.6062 46.5107 59.6627 46.5295 59.7191C46.6988 60.0201 46.8305 60.3211 46.9058 60.6597C46.9434 60.8667 46.981 61.0924 46.981 61.3182C46.981 63.1242 45.4948 64.6104 43.6888 64.6104H43.6512ZM58.7014 64.6104C56.8954 64.6104 55.4092 63.1242 55.4092 61.3182C55.4092 61.0924 55.428 60.8667 55.4844 60.6597C55.5409 60.434 55.5973 60.2082 55.6914 60.0013C55.6914 60.0013 55.6914 59.9825 55.6914 59.9637C55.7854 59.7755 55.8795 59.5874 56.0112 59.4181C56.03 59.3805 56.0676 59.3617 56.0864 59.324C56.1993 59.1735 56.3122 59.0418 56.4439 58.9102C56.4815 58.8725 56.5191 58.8537 56.5568 58.8161C56.6885 58.7032 56.839 58.5903 56.9895 58.4963C57.0271 58.4775 57.0835 58.4398 57.14 58.421C57.3093 58.327 57.4974 58.2517 57.6855 58.1953C57.7608 58.1765 57.836 58.1388 57.9301 58.12C58.1747 58.0636 58.4381 58.0259 58.7014 58.0259C59.0589 58.0259 59.3975 58.1012 59.7361 58.2141C59.7926 58.2141 59.8302 58.2329 59.8866 58.2517C60.1876 58.3646 60.4698 58.5339 60.7144 58.722C60.7708 58.7596 60.8085 58.7973 60.8649 58.8349C61.1095 59.0418 61.3164 59.2864 61.4857 59.5498C61.5234 59.5874 61.5422 59.6439 61.561 59.7003C61.7303 60.0013 61.862 60.3023 61.9372 60.6409C61.9749 60.8479 62.0125 61.0736 62.0125 61.2994C62.0125 63.1054 60.5263 64.5916 58.7202 64.5916L58.7014 64.6104ZM57.7608 51.4415V45.7976H61.5234C63.8562 45.7976 65.7563 47.6977 65.7563 50.0305V51.4415H57.7608Z"
										fill="#916F96"
									/>
								</svg>

								<h2 class="font-medium text-4xl mt-5">
									{{ slotProps.data.title }}
								</h2>
								<p class="text-lg">
									{{ slotProps.data.description }}
								</p>
							</div>
						</template>
					</Carousel>
				</div>
			</div>
		</div>
		<div class="w-full md:w-6">
			<div
				class="w-full h-full p-4 md:p-8 flex flex-column align-items-center"
			>
				<div
					class="flex h-full flex-column align-items-center justify-content-center w-full md:w-6"
				>
					<div class="mb-4 w-full">
						<div class="md:hidden mb-6">
							<RouterLink to="/">
								<img
									src="../../assets/images/logo.svg"
									alt="logo"
								/>
							</RouterLink>
						</div>
						<h1
							class="text-900 text-5xl font-normal mb-3 text-primary font-serif"
						>
							Sign In
						</h1>
						<span class="font-normal text-600">
							Don't have an account?
							<RouterLink
								to="/auth/register"
								class="no-underline text-green-400"
							>
								Register Today!
							</RouterLink>
						</span>
					</div>
					<form @submit="onSubmit" class="w-full">
						<div class="field">
							<label for="email">Email</label>
							<InputText
								id="email"
								v-model="email"
								placeholder="Email address"
								:invalid="emailError"
								fluid
								aria-describedby="email-error"
							/>
							<small class="p-error" id="email-error">{{
								emailError || "&nbsp;"
							}}</small>
						</div>
						<div class="field">
							<div
								class="flex align-items-center justify-content-between mb-2"
							>
								<label for="password">Password</label>
								<RouterLink
									to="/auth/forgot-password"
									class="no-underline text-green-400"
									>Forgot Password?
								</RouterLink>
							</div>
							<Password
								id="password"
								v-model="password"
								placeholder="Password"
								:invalid="passwordError"
								:feedback="false"
								fluid
								toggleMask
							/>
							<small id="password-error" class="p-error">{{
								passwordError || "&nbsp;"
							}}</small>
						</div>
						<Button
							type="submit"
							:loading="loading"
							:disabled="loading"
							label="Sign In"
							class="mt-2 w-full"
							rounded
							size="large"
						/>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>
