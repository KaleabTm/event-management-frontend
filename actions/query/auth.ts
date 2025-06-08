import { useRouter } from "next/navigation";

import { useMutation, useQuery } from "@tanstack/react-query";
import { login, register, logout, getCurrentUser } from "@/actions/auth/action";

import { PAGES, AUTH_FORM } from "@/constants/colors";
import { toast } from "sonner"; // or wherever your toast comes from

export function useLogin() {
	const router = useRouter();

	return useMutation({
		mutationFn: login,
		onMutate: () => {
			toast.dismiss();
			toast.loading("Logging in...");
		},
		onSuccess: () => {
			toast.dismiss();
			toast.success("Welcome back!");
			router.push("/dashboard");
		},
		onError: (error: unknown) => {
			toast.dismiss();
			toast.error(
				error instanceof Error ? error.message : "Login failed. Please try again."
			);
		},
	});
}

export function useRegister() {
	const router = useRouter();

	return useMutation({
		mutationKey: ["register"],
		mutationFn: register,
		onMutate: () => {
			toast.dismiss();
			toast.loading("Creating account...");
		},
		onSuccess: () => {
			toast.dismiss();
			toast.success("Account created successfully!");
			router.push("/dashboard");
		},
		onError: (error: unknown) => {
			toast.dismiss();
			toast.error(
				error instanceof Error
					? error.message
					: "Registration failed. Please try again."
			);
		},
	});
}

export const useLogout = () => {
	const router = useRouter(); // Initialize the router
	return useMutation({
		mutationKey: ["logout"],
		mutationFn: logout,
		onMutate: () => {
			toast.dismiss();
			toast.loading("በመውጣት ላይ፣ እባክዎን ትንሽ ይጠብቁ...");
		},
		onSuccess: () => {
			toast.dismiss();
			toast.success("Logout... 👋🏾BYE!");
			router.push("/"); // Redirect to login page after logout
		},
		onError: (errorMessage: string) => {
			toast.dismiss();
			toast.error(errorMessage);
		},
	});
};

export const useFetchMe = (enable: boolean) => {
	return useQuery({
		queryKey: ["getme"],
		queryFn: async () => {
			try {
				const data = await getCurrentUser();
				return data;
			} catch (error: any) {
				toast.error(error.message);
				throw error;
			}
		},
		enabled: enable,
	});
};
