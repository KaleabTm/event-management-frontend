export const CALENDAR_COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
] as const

export const DEFAULT_CALENDARS = [
  { name: "Personal", color: "#3B82F6", description: "Personal events and appointments" },
  { name: "Work", color: "#EF4444", description: "Work-related events and meetings" },
  { name: "Family", color: "#10B981", description: "Family events and activities" },
] as const

export const WEEKDAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
] as const
