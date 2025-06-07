import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface User {
		id: string;
		email?: string | null;
	}

	interface Session {
		user: {
			id: string;
			email?: string | null;
		} & DefaultSession["user"];
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		email?: string | null;
	}
}
