// ICS file generation utilities
interface Event {
	id: string;
	title: string;
	description?: string;
	start: string;
	end: string;
	allDay: boolean;
	color: string;
	calendarId: string;
	recurrence: {
		type: "none" | "daily" | "weekly" | "monthly" | "yearly" | "custom";
		interval: number;
		weekdays: number[];
		monthlyType: "date" | "weekday";
		weekdayOrdinal: number;
		endDate?: string;
		endAfter: number;
	};
}

export function generateICSContent(
	events: Event[],
	calendarName?: string
): string {
	const now = new Date();
	const timestamp = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

	const icsContent = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//Event Manager//Event Manager//EN",
		"CALSCALE:GREGORIAN",
		"METHOD:PUBLISH",
		`X-WR-CALNAME:${calendarName || "My Events"}`,
		"X-WR-TIMEZONE:UTC",
	];

	events.forEach((event) => {
		const startDate = new Date(event.start);
		const endDate = new Date(event.end);

		const formatDate = (date: Date, allDay: boolean) => {
			if (allDay) {
				return date.toISOString().split("T")[0].replace(/-/g, "");
			}
			return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
		};

		icsContent.push(
			"BEGIN:VEVENT",
			`UID:${event.id}@eventmanager.com`,
			`DTSTAMP:${timestamp}`,
			`DTSTART${event.allDay ? ";VALUE=DATE" : ""}:${formatDate(startDate, event.allDay)}`,
			`DTEND${event.allDay ? ";VALUE=DATE" : ""}:${formatDate(endDate, event.allDay)}`,
			`SUMMARY:${event.title.replace(/,/g, "\\,")}`,
			event.description
				? `DESCRIPTION:${event.description.replace(/,/g, "\\,").replace(/\n/g, "\\n")}`
				: "",
			`CATEGORIES:${event.calendarId}`,
			"STATUS:CONFIRMED",
			"TRANSP:OPAQUE"
		);

		// Add recurrence rule if applicable
		if (event.recurrence.type !== "none") {
			const rrule = generateRRule(event.recurrence);
			if (rrule) {
				icsContent.push(`RRULE:${rrule}`);
			}
		}

		icsContent.push("END:VEVENT");
	});

	icsContent.push("END:VCALENDAR");

	return icsContent.filter((line) => line !== "").join("\r\n");
}

function generateRRule(recurrence: Event["recurrence"]): string {
	const parts = [`FREQ=${recurrence.type.toUpperCase()}`];

	if (recurrence.interval > 1) {
		parts.push(`INTERVAL=${recurrence.interval}`);
	}

	if (recurrence.type === "custom" && recurrence.weekdays.length > 0) {
		const dayMap = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
		const days = recurrence.weekdays.map((day) => dayMap[day]).join(",");
		parts.push(`BYDAY=${days}`);
	}

	if (recurrence.endDate) {
		const endDate = new Date(recurrence.endDate)
			.toISOString()
			.split("T")[0]
			.replace(/-/g, "");
		parts.push(`UNTIL=${endDate}`);
	} else if (recurrence.endAfter) {
		parts.push(`COUNT=${recurrence.endAfter}`);
	}

	return parts.join(";");
}

export function downloadICSFile(content: string, filename: string): void {
	const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(link.href);
}

export function exportSingleEvent(event: Event): void {
	const icsContent = generateICSContent([event], event.title);
	const filename = `${event.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.ics`;
	downloadICSFile(icsContent, filename);
}

export function exportCalendar(events: Event[], calendarName: string): void {
	const icsContent = generateICSContent(events, calendarName);
	const filename = `${calendarName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_calendar.ics`;
	downloadICSFile(icsContent, filename);
}
