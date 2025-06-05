import { HOME_PAGE } from "./home-page"
import { DASHBOARD_PAGE } from "./dashboard-page"
import { AUTH_PAGE } from "./auth-page"

export const PAGES = {
  HOME: HOME_PAGE.ROUTE,
  DASHBOARD: DASHBOARD_PAGE.ROUTE,
  LOGIN: AUTH_PAGE.LOGIN.ROUTE,
  REGISTER: AUTH_PAGE.REGISTER.ROUTE,
} as const
