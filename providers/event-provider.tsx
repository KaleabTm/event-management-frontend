"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";

export interface Event {
	id: string;
	title: string;
	description?: string;
	startDate: string;
	endDate: string;
	startTime: string;
	endTime: string;
	recurrence: {
		type: "none" | "daily" | "weekly" | "monthly" | "yearly" | "custom";
		interval?: number;
		weekdays?: number[];
		monthlyType?: "date" | "weekday";
		weekdayOrdinal?: number;
		endDate?: string;
		endAfter?: number;
	};
	color: string;
}

interface EventContextType {
	events: Event[];
	addEvent: (event: Omit<Event, "id">) => void;
	updateEvent: (id: string, event: Partial<Event>) => void;
	deleteEvent: (id: string) => void;
	deleteEventInstance: (id: string, date: string) => void;
	getEventsForDate: (date: string) => Event[];
	getUpcomingEvents: (limit?: number) => Event[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
	const [events, setEvents] = useState<Event[]>([]);

	useEffect(() => {
		// Load events from localStorage
		const savedEvents = localStorage.getItem("events");
		if (savedEvents) {
			setEvents(JSON.parse(savedEvents));
		}
	}, []);

	useEffect(() => {
		// Save events to localStorage
		localStorage.setItem("events", JSON.stringify(events));
	}, [events]);

	const addEvent = (eventData: Omit<Event, "id">) => {
		const newEvent: Event = {
			...eventData,
			id: Date.now().toString(),
		};
		setEvents((prev) => [...prev, newEvent]);
	};

	const updateEvent = (id: string, eventData: Partial<Event>) => {
		setEvents((prev) =>
			prev.map((event) => (event.id === id ? { ...event, ...eventData } : event))
		);
	};

	const deleteEvent = (id: string) => {
		setEvents((prev) => prev.filter((event) => event.id !== id));
	};

	const deleteEventInstance = (id: string, date: string) => {
		// For now, we'll just delete the entire event
		// In a real app, you'd track deleted instances
		deleteEvent(id);
	};

	const getEventsForDate = (date: string): Event[] => {
		return events.filter((event) => {
			// Simple date matching - in a real app, you'd handle recurrence properly
			return (
				event.startDate === date ||
				(event.recurrence.type !== "none" && isRecurringEventOnDate(event, date))
			);
		});
	};

	const getUpcomingEvents = (limit = 10): Event[] => {
		const today = new Date().toISOString().split("T")[0];
		return events
			.filter((event) => event.startDate >= today)
			.sort((a, b) => a.startDate.localeCompare(b.startDate))
			.slice(0, limit);
	};

	const isRecurringEventOnDate = (event: Event, date: string): boolean => {
		// Simplified recurrence logic - in a real app, this would be much more complex
		const eventDate = new Date(event.startDate);
		const checkDate = new Date(date);

		if (checkDate < eventDate) return false;

		const daysDiff = Math.floor(
			(checkDate.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24)
		);

		switch (event.recurrence.type) {
			case "daily":
				return daysDiff % (event.recurrence.interval || 1) === 0;
			case "weekly":
				const weeksDiff = Math.floor(daysDiff / 7);
				return (
					weeksDiff % (event.recurrence.interval || 1) === 0 &&
					checkDate.getDay() === eventDate.getDay()
				);
			case "monthly":
				return checkDate.getDate() === eventDate.getDate();
			case "yearly":
				return (
					checkDate.getMonth() === eventDate.getMonth() &&
					checkDate.getDate() === eventDate.getDate()
				);
			default:
				return false;
		}
	};

	return (
		<EventContext.Provider
			value={{
				events,
				addEvent,
				updateEvent,
				deleteEvent,
				deleteEventInstance,
				getEventsForDate,
				getUpcomingEvents,
			}}
		>
			{children}
		</EventContext.Provider>
	);
}

export function useEvents() {
	const context = useContext(EventContext);
	if (context === undefined) {
		throw new Error("useEvents must be used within an EventProvider");
	}
	return context;
}
