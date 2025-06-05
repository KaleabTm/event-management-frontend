import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Simple in-memory user storage (replace with database in production)
const users = new Map<string, { id: string; email: string; password: string; name: string }>()

// Add a default user for testing
users.set("test@example.com", {
  id: "1",
  email: "test@example.com",
  password: "password123", // In production, this should be hashed
  name: "Test User",
})

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        action: { label: "Action", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        const { email, password, name, action } = credentials

        try {
          if (action === "register") {
            // Check if user already exists
            if (users.has(email)) {
              throw new Error("User already exists")
            }

            // Create new user
            const user = {
              id: Date.now().toString(),
              email,
              password, // In production, hash this password
              name: name || email.split("@")[0],
            }

            users.set(email, user)

            return {
              id: user.id,
              email: user.email,
              name: user.name,
            }
          } else {
            // Login
            const user = users.get(email)
            if (!user || user.password !== password) {
              throw new Error("Invalid credentials")
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
            }
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here",
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
}
