// Calendar management functions
interface Calendar {
	id: string;
	name: string;
	description?: string;
	color: string;
	is_visible: boolean;
	userId: string;
	created_at: string;
	updated_at: string;
}

// Simple in-memory storage (replace with database in production)
const calendars = new Map<string, Calendar[]>();

// Default calendars for new users
const defaultCalendars = [
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
];

export async function getCalendars(userId: string): Promise<Calendar[]> {
	let userCalendars = calendars.get(userId);

	// Create default calendars if none exist
	if (!userCalendars || userCalendars.length === 0) {
		userCalendars = defaultCalendars.map((cal, index) => ({
			id: `${Date.now()}-${index}`,
			...cal,
			is_visible: true,
			userId,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		}));
		calendars.set(userId, userCalendars);
	}

	return userCalendars;
}

export async function createCalendar(
	userId: string,
	calendarData: Omit<Calendar, "id" | "userId" | "created_at" | "updated_at">
): Promise<Calendar> {
	const calendar: Calendar = {
		...calendarData,
		id: Date.now().toString(),
		userId,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	};

	const userCalendars = calendars.get(userId) || [];
	userCalendars.push(calendar);
	calendars.set(userId, userCalendars);

	return calendar;
}

export async function updateCalendar(
	calendarId: string,
	userId: string,
	calendarData: Partial<Omit<Calendar, "id" | "userId" | "created_at">>
): Promise<Calendar> {
	const userCalendars = calendars.get(userId) || [];
	const calendarIndex = userCalendars.findIndex((c) => c.id === calendarId);

	if (calendarIndex === -1) {
		throw new Error("Calendar not found");
	}

	const updatedCalendar = {
		...userCalendars[calendarIndex],
		...calendarData,
		updated_at: new Date().toISOString(),
	};

	userCalendars[calendarIndex] = updatedCalendar;
	calendars.set(userId, userCalendars);

	return updatedCalendar;
}

export async function deleteCalendar(
	calendarId: string,
	userId: string
): Promise<void> {
	const userCalendars = calendars.get(userId) || [];
	const filteredCalendars = userCalendars.filter((c) => c.id !== calendarId);

	if (filteredCalendars.length === userCalendars.length) {
		throw new Error("Calendar not found");
	}

	calendars.set(userId, filteredCalendars);
}
