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
      NAME: "end",
      LABEL: "End Date & Time",
      TYPE: "datetime-local",
    },
    ALL_DAY: {
      NAME: "allDay",
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
  VALIDATION: {
    TITLE_REQUIRED: "Event title is required",
    TITLE_TOO_LONG: "Title is too long (max 100 characters)",
    START_DATE_REQUIRED: "Start date is required",
    END_DATE_REQUIRED: "End date is required",
    INVALID_DATE: "Please enter a valid date",
    END_BEFORE_START: "End date must be after start date",
    CALENDAR_REQUIRED: "Please select a calendar",
  },
} as const
