// utils/setEncryptedSessionCookie.ts
import { cookies } from "next/headers";
import { encrypt } from "@/actions/auth/action"; // update path based on where your encrypt function lives

const SESSION_NAME = process.env.SESSION_NAME;

export async function setEncryptedSessionCookie(sessionId: string) {
	if (!SESSION_NAME) {
		throw new Error("SESSION_NAME environment variable is not defined");
	}
	const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
	const session = await encrypt({ sessionId, expires });

	cookies().set(SESSION_NAME, session, {
		expires: new Date(expires),
		httpOnly: true,
		sameSite: "lax",
		secure: false, // true in production with HTTPS
	});
}
