"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	authSchema,
	AuthFormData,
	RegisterFormData,
} from "@/lib/validations/event"; // unified schema and type
import { useLogin, useRegister } from "@/actions/query/auth";
import { useToast } from "@/hooks/use-toast";
import { PAGES, AUTH_FORM } from "@/constants/colors";

export default function AuthForm() {
	const [isLogin, setIsLogin] = useState(true);
	const router = useRouter();
	const { toast } = useToast();

	const loginMutation = useLogin();
	const registerMutation = useRegister();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<AuthFormData>({
		resolver: zodResolver(authSchema),
		defaultValues: {
			action: isLogin ? "login" : "register",
		},
	});

	const onSubmit = (data: AuthFormData) => {
		console.log("Submitting form", data);

		if (data.action === "login") {
			loginMutation.mutate({
				email: data.email,
				password: data.password,
			});
		} else {
			registerMutation.mutate(data);
		}
	};
	const toggleMode = () => {
		setIsLogin((prev) => !prev);
		reset({
			email: "",
			password: "",
			first_name: "",
			last_name: "",
			phone_number: "",
			action: !isLogin ? "login" : "register",
		});
	};

	const isLoading = loginMutation.isPending || registerMutation.isPending;
	const error = loginMutation.error || registerMutation.error;

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl text-center">
					{isLogin ? AUTH_FORM.BUTTONS.LOGIN : AUTH_FORM.BUTTONS.REGISTER}
				</CardTitle>
				<CardDescription className="text-center">
					{isLogin
						? "Enter your credentials to access your events"
						: "Create a new account to get started"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{/* {error && (
            <Alert variant="destructive">
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )} */}

					<div className="space-y-2">
						<Label htmlFor="email">{AUTH_FORM.FIELDS.EMAIL.LABEL}</Label>
						<Input
							id="email"
							type="email"
							placeholder={AUTH_FORM.FIELDS.EMAIL.PLACEHOLDER}
							{...register("email")}
							className={errors.email ? "border-destructive" : ""}
						/>
						{errors.email && (
							<p className="text-sm text-destructive">{errors.email.message}</p>
						)}
					</div>
					{!isLogin && (
						<div className="space-y-4 flex-row gap-4">
							<div className="my-2">
								<Label htmlFor={AUTH_FORM.FIELDS.FIRST_NAME.NAME}>
									{AUTH_FORM.FIELDS.FIRST_NAME.LABEL}
								</Label>
								<Input
									id={AUTH_FORM.FIELDS.FIRST_NAME.NAME}
									type={AUTH_FORM.FIELDS.FIRST_NAME.TYPE}
									placeholder={AUTH_FORM.FIELDS.FIRST_NAME.PLACEHOLDER}
									{...register("first_name")}
									className={
										(errors as FieldErrors<RegisterFormData>).first_name
											? "border-destructive"
											: ""
									}
								/>
								{(errors as FieldErrors<RegisterFormData>).first_name && (
									<p className="text-sm text-destructive">
										{(errors as FieldErrors<RegisterFormData>).first_name?.message}
									</p>
								)}
							</div>

							<div>
								<Label htmlFor={AUTH_FORM.FIELDS.LAST_NAME.NAME}>
									{AUTH_FORM.FIELDS.LAST_NAME.LABEL}
								</Label>
								<Input
									id={AUTH_FORM.FIELDS.LAST_NAME.NAME}
									type={AUTH_FORM.FIELDS.LAST_NAME.TYPE}
									placeholder={AUTH_FORM.FIELDS.LAST_NAME.PLACEHOLDER}
									{...register("last_name")}
									className={
										(errors as FieldErrors<RegisterFormData>).last_name
											? "border-destructive"
											: ""
									}
								/>
								{(errors as FieldErrors<RegisterFormData>).last_name && (
									<p className="text-sm text-destructive">
										{(errors as FieldErrors<RegisterFormData>).last_name?.message}
									</p>
								)}
							</div>

							<div>
								<Label htmlFor={AUTH_FORM.FIELDS.PHONE_NUMBER.NAME}>
									{AUTH_FORM.FIELDS.PHONE_NUMBER.LABEL}
								</Label>
								<Input
									id={AUTH_FORM.FIELDS.PHONE_NUMBER.NAME}
									type={AUTH_FORM.FIELDS.PHONE_NUMBER.TYPE}
									placeholder={AUTH_FORM.FIELDS.PHONE_NUMBER.PLACEHOLDER}
									{...register("phone_number")}
									className={
										(errors as FieldErrors<RegisterFormData>).phone_number
											? "border-destructive"
											: ""
									}
								/>
								{(errors as FieldErrors<RegisterFormData>).phone_number && (
									<p className="text-sm text-destructive">
										{(errors as FieldErrors<RegisterFormData>).phone_number?.message}
									</p>
								)}
							</div>
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="password">{AUTH_FORM.FIELDS.PASSWORD.LABEL}</Label>
						<Input
							id="password"
							type="password"
							placeholder={AUTH_FORM.FIELDS.PASSWORD.PLACEHOLDER}
							{...register("password")}
							className={errors.password ? "border-destructive" : ""}
						/>
						{errors.password && (
							<p className="text-sm text-destructive">{errors.password.message}</p>
						)}
					</div>

					<input
						type="hidden"
						{...register("action")}
						value={isLogin ? "login" : "register"}
					/>

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading
							? AUTH_FORM.BUTTONS.LOADING
							: isLogin
								? AUTH_FORM.BUTTONS.LOGIN
								: AUTH_FORM.BUTTONS.REGISTER}
					</Button>

					<div className="text-center">
						<Button
							type="button"
							variant="link"
							onClick={toggleMode}
							className="text-sm"
						>
							{isLogin
								? AUTH_FORM.BUTTONS.TOGGLE_REGISTER
								: AUTH_FORM.BUTTONS.TOGGLE_LOGIN}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
