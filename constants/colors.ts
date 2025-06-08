export const CALENDAR_COLORS = [
	"#3B82F6", // Blue
	"#EF4444", // Red
	"#10B981", // Green
	"#F59E0B", // Yellow
	"#8B5CF6", // Purple
	"#EC4899", // Pink
	"#06B6D4", // Cyan
	"#84CC16", // Lime
] as const;

export const DEFAULT_CALENDARS = [
	{
		name: "Personal",
		color: "#3B82F6",
		description: "Personal events and appointments",
	},
	{
		name: "Work",
		color: "#EF4444",
		description: "Work-related events and meetings",
	},
	{
		name: "Family",
		color: "#10B981",
		description: "Family events and activities",
	},
] as const;

export const WEEKDAYS = [
	{ value: 0, label: "Sunday" },
	{ value: 1, label: "Monday" },
	{ value: 2, label: "Tuesday" },
	{ value: 3, label: "Wednesday" },
	{ value: 4, label: "Thursday" },
	{ value: 5, label: "Friday" },
	{ value: 6, label: "Saturday" },
] as const;

// Form constants
export const AUTH_FORM = {
	FIELDS: {
		EMAIL: {
			NAME: "email",
			LABEL: "Email Address",
			PLACEHOLDER: "Enter your email address",
			TYPE: "email",
		},
		PASSWORD: {
			NAME: "password",
			LABEL: "Password",
			PLACEHOLDER: "Enter your password",
			TYPE: "password",
		},
		FIRST_NAME: {
			NAME: "first_name",
			LABEL: "First Name",
			PLACEHOLDER: "Enter your first name",
			TYPE: "text",
		},
		LAST_NAME: {
			NAME: "last_name",
			LABEL: "Last Name",
			PLACEHOLDER: "Enter your last name",
			TYPE: "text",
		},
		PHONE_NUMBER: {
			NAME: "phone_number",
			LABEL: "Phone Number",
			PLACEHOLDER: "Enter your phone number",
			TYPE: "tel", // or "number", but "tel" is better for formatted input
		},
	},
	BUTTONS: {
		LOGIN: "Sign In",
		REGISTER: "Create Account",
		LOADING: "Please wait...",
		TOGGLE_LOGIN: "Already have an account? Sign in",
		TOGGLE_REGISTER: "Don't have an account? Sign up",
	},
	VALIDATION: {
		EMAIL_REQUIRED: "Email address is required",
		EMAIL_INVALID: "Please enter a valid email address",
		PASSWORD_REQUIRED: "Password is required",
		PASSWORD_MIN_LENGTH: "Password must be at least 6 characters",
		FIRST_NAME_REQUIRED: "First name is required",
		LAST_NAME_REQUIRED: "Last name is required",
		PHONE_NUMBER_REQUIRED: "Phone number is required",
		PASSWORDS_DONT_MATCH: "Passwords do not match",
	},
} as const;

export const EVENT_FORM = {
	FIELDS: {
		TITLE: {
			NAME: "title",
			LABEL: "Event Title",
			PLACEHOLDER: "Enter event title",
			TYPE: "text",
		},
		DESCRIPTION: {
			NAME: "description",
			LABEL: "Description",
			PLACEHOLDER: "Enter event description (optional)",
			TYPE: "textarea",
		},
		START_DATE: {
			NAME: "start",
			LABEL: "Start Date & Time",
			TYPE: "datetime-local",
		},
		END_DATE: {
			NAME: "end_time",
			LABEL: "End Date & Time",
			TYPE: "datetime-local",
		},
		ALL_DAY: {
			NAME: "is_all_day",
			LABEL: "All Day Event",
			TYPE: "checkbox",
		},
		CALENDAR: {
			NAME: "calendarId",
			LABEL: "Calendar",
			PLACEHOLDER: "Select a calendar",
			TYPE: "select",
		},
		COLOR: {
			NAME: "color",
			LABEL: "Event Color",
			TYPE: "color",
		},
		RECURRENCE: {
			NAME: "recurrence",
			LABEL: "Recurrence",
			TYPE: "select",
			OPTIONS: {
				NONE: { value: "none", label: "No Recurrence" },
				DAILY: { value: "daily", label: "Daily" },
				WEEKLY: { value: "weekly", label: "Weekly" },
				MONTHLY: { value: "monthly", label: "Monthly" },
				YEARLY: { value: "yearly", label: "Yearly" },
				CUSTOM: { value: "custom", label: "Custom" },
			},
		},
	},
	BUTTONS: {
		CREATE: "Create Event",
		UPDATE: "Update Event",
		CANCEL: "Cancel",
		DELETE: "Delete",
		EXPORT: "Export Event",
		SAVING: "Saving...",
	},
} as const;

export const CALENDAR_FORM = {
	FIELDS: {
		NAME: {
			NAME: "name",
			LABEL: "Calendar Name",
			PLACEHOLDER: "e.g., Work, Personal, Family",
			TYPE: "text",
		},
		DESCRIPTION: {
			NAME: "description",
			LABEL: "Description",
			PLACEHOLDER: "Optional description for this calendar",
			TYPE: "textarea",
		},
		COLOR: {
			NAME: "color",
			LABEL: "Calendar Color",
			TYPE: "color",
		},
	},
	BUTTONS: {
		CREATE: "Create Calendar",
		UPDATE: "Update Calendar",
		CANCEL: "Cancel",
		DELETE: "Delete",
		SAVING: "Saving...",
	},
} as const;

// Page constants
export const PAGES = {
	HOME: "/",
	DASHBOARD: "/dashboard",
} as const;

export const DASHBOARD_PAGE = {
	TITLE: "Dashboard",
	SECTIONS: {
		HEADER: "Your Events",
		CALENDAR_SIDEBAR: "My Calendars",
		TABS: {
			CALENDAR: "Calendar",
			LIST: "List",
		},
	},
} as const;

export const COMMON_BUTTONS = {
	SAVE: "Save",
	CANCEL: "Cancel",
	DELETE: "Delete",
	EDIT: "Edit",
	CREATE: "Create",
	UPDATE: "Update",
	EXPORT: "Export",
	LOADING: "Loading...",
	SAVING: "Saving...",
	DELETING: "Deleting...",
	LOGOUT: "Logout",
} as const;
