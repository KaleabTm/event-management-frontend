export const PAGES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  LOGIN: "/login",
  REGISTER: "/register",
} as const

export const PAGE_TITLES = {
  [PAGES.HOME]: "Event Manager",
  [PAGES.DASHBOARD]: "Dashboard - Event Manager",
  [PAGES.LOGIN]: "Login - Event Manager",
  [PAGES.REGISTER]: "Register - Event Manager",
} as const

export const PAGE_DESCRIPTIONS = {
  [PAGES.HOME]: "Manage your events with ease",
  [PAGES.DASHBOARD]: "Your event dashboard",
  [PAGES.LOGIN]: "Sign in to your account",
  [PAGES.REGISTER]: "Create a new account",
} as const
