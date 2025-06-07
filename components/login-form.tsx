"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { useAuth } from "./auth-provider";

export default function LoginForm() {
	const [isLogin, setIsLogin] = useState(true);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { login, register, user } = useAuth();
	const router = useRouter();

	// Redirect if already logged in
	if (user) {
		router.push("/dashboard");
		return null;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		// Form validation
		if (!username || !password) {
			setError("Please fill in all required fields");
			setIsLoading(false);
			return;
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters long");
			setIsLoading(false);
			return;
		}

		if (!isLogin) {
			if (!email) {
				setError("Email is required for registration");
				setIsLoading(false);
				return;
			}
			if (password !== confirmPassword) {
				setError("Passwords do not match");
				setIsLoading(false);
				return;
			}
		}

		try {
			let success = false;
			if (isLogin) {
				success = await login(username, password);
			} else {
				success = await register(username, email, password);
			}

			if (success) {
				router.push("/dashboard");
			} else {
				setError(isLogin ? "Invalid credentials" : "Registration failed");
			}
		} catch (err) {
			setError("An error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{isLogin ? "Login" : "Create Account"}</CardTitle>
				<CardDescription>
					{isLogin
						? "Enter your credentials to access your events"
						: "Create a new account to get started"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<div className="space-y-2">
						<Label htmlFor="username">Username</Label>
						<Input
							id="username"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>

					{!isLogin && (
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					{!isLogin && (
						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm Password</Label>
							<Input
								id="confirmPassword"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
							/>
						</div>
					)}

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
					</Button>

					<div className="text-center">
						<Button
							type="button"
							variant="link"
							onClick={() => {
								setIsLogin(!isLogin);
								setError("");
								setUsername("");
								setEmail("");
								setPassword("");
								setConfirmPassword("");
							}}
						>
							{isLogin
								? "Don't have an account? Sign up"
								: "Already have an account? Login"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
