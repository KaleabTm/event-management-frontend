export const FORM_VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  EMAIL_INVALID: "Please enter a valid email address",
  PASSWORD_MIN_LENGTH: "Password must be at least 6 characters",
  PASSWORDS_DONT_MATCH: "Passwords do not match",
  TITLE_TOO_LONG: "Title is too long",
  INVALID_DATE: "Please enter a valid date",
  END_BEFORE_START: "End date must be after start date",
} as const

export const FORM_PLACEHOLDERS = {
  EMAIL: "Enter your email",
  PASSWORD: "Enter your password",
  CONFIRM_PASSWORD: "Confirm your password",
  NAME: "Enter your full name",
  EVENT_TITLE: "Enter event title",
  EVENT_DESCRIPTION: "Enter event description (optional)",
  CALENDAR_NAME: "e.g., Work, Personal, Family",
  CALENDAR_DESCRIPTION: "Optional description for this calendar",
} as const

export const FORM_LABELS = {
  EMAIL: "Email",
  PASSWORD: "Password",
  CONFIRM_PASSWORD: "Confirm Password",
  NAME: "Full Name",
  EVENT_TITLE: "Event Title",
  EVENT_DESCRIPTION: "Description",
  CALENDAR_NAME: "Calendar Name",
  CALENDAR_DESCRIPTION: "Description",
  START_DATE: "Start Date",
  END_DATE: "End Date",
  ALL_DAY: "All Day Event",
  RECURRENCE: "Recurrence",
} as const

export const BUTTON_LABELS = {
  LOGIN: "Login",
  REGISTER: "Create Account",
  LOGOUT: "Logout",
  SAVE: "Save",
  CANCEL: "Cancel",
  DELETE: "Delete",
  EDIT: "Edit",
  CREATE: "Create",
  EXPORT: "Export",
  LOADING: "Loading...",
  SAVING: "Saving...",
  DELETING: "Deleting...",
} as const
