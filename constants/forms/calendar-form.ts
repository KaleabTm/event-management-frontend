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
    VISIBILITY: {
      NAME: "isVisible",
      LABEL: "Visible",
      TYPE: "checkbox",
    },
  },
  BUTTONS: {
    CREATE: "Create Calendar",
    UPDATE: "Update Calendar",
    CANCEL: "Cancel",
    DELETE: "Delete",
    SAVING: "Saving...",
  },
  VALIDATION: {
    NAME_REQUIRED: "Calendar name is required",
    NAME_TOO_LONG: "Name is too long (max 50 characters)",
    INVALID_COLOR: "Please select a valid color",
  },
  COLORS: ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"],
} as const
