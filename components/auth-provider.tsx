"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";

interface User {
	id: string;
	username: string;
	email: string;
}

interface AuthContextType {
	user: User | null;
	login: (username: string, password: string) => Promise<boolean>;
	register: (
		username: string,
		email: string,
		password: string
	) => Promise<boolean>;
	logout: () => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check for existing session
		const savedUser = localStorage.getItem("user");
		if (savedUser) {
			setUser(JSON.parse(savedUser));
		}
		setIsLoading(false);
	}, []);

	const login = async (username: string, password: string): Promise<boolean> => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Simple validation - in real app, this would be server-side
		if (username && password.length >= 6) {
			const userData = {
				id: "1",
				username,
				email: `${username}@example.com`,
			};
			setUser(userData);
			localStorage.setItem("user", JSON.stringify(userData));
			return true;
		}
		return false;
	};

	const register = async (
		username: string,
		email: string,
		password: string
	): Promise<boolean> => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		if (username && email && password.length >= 6) {
			const userData = {
				id: "1",
				username,
				email,
			};
			setUser(userData);
			localStorage.setItem("user", JSON.stringify(userData));
			return true;
		}
		return false;
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
		localStorage.removeItem("events");
	};

	return (
		<AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
