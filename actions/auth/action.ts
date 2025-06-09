"use server";

import axiosInstance from "../axiosInstance";
import type { LoginFormData, RegisterFormData } from "@/types/auth";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { setEncryptedSessionCookie } from "@/lib/utils/setEncryptedSessionCookie";

const SESSION_NAME = process.env.SESSION_NAME;

const secretKey = "secret";

const key = new TextEncoder().encode(secretKey);

export interface ICredentials {
	email: string;
	password: string;
}

export async function setEmail(email: string) {
	cookies().set("email", email, { httpOnly: true });
}

export async function getEmail() {
	const email = cookies().get("email")?.value;
	if (!email) throw new Error("Email not set");
	return email;
}

export async function encrypt(payload: any) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("1 day")
		.sign(key);
}

export async function decrypt(input: string): Promise<any> {
	const { payload } = await jwtVerify(input, key, {
		algorithms: ["HS256"],
	});
	return payload;
}

export async function get_session() {
	const session = cookies().get(SESSION_NAME ?? "session")?.value;
	if (!session) return null;

	return await decrypt(session);
}

export async function login(credentials: LoginFormData) {
	const response = await axiosInstance.post("auth/login/", credentials);

	await setEncryptedSessionCookie(response.data.session);

	if (!response || !response.data || !response.data.session) {
		throw new Error("Invalid email or password");
	}

	return { success: true };
}

export async function register(data: RegisterFormData) {
	try {
		const response = await axiosInstance.post("auth/register/", data);

		await setEncryptedSessionCookie(response.data.session);

		return { success: true, data: response.data };
	} catch (error: any) {
		console.error("Registration error:", error);
		throw new Error(error.response?.data?.message || "Registration failed");
	}
}

export async function logout() {
	try {
		// await axiosInstance.get("auth/logout/");
		cookies().set(SESSION_NAME ?? "session", "", { expires: new Date(0) });

		return { success: true };
	} catch (error: any) {
		console.error("Logout error:", error);
		throw new Error(error.response?.data?.message || "Logout failed");
	}
}

export async function getCurrentUser() {
	try {
		const response = await axiosInstance.get("auth/me/");
		const data = await response.data;
		return data.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || "Logout failed");
	}
}
