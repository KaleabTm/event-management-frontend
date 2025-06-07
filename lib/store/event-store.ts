import {
	createEventAction,
	deleteEventAction,
	fetchEventsAction,
	getEventByIdAction,
	updateEventAction,
} from "@/actions/events/action";
import type { Event } from "@/types/event";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface EventStore {
	events: Event[];
	isLoading: boolean;
	error: string | null;

	fetchEvents: () => Promise<void>;
	addEvent: (
		event: Omit<Event, "id" | "userId" | "createdAt" | "updatedAt">
	) => Promise<void>;
	updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
	deleteEvent: (id: string) => Promise<void>;
	getEventById: (id: string) => Promise<Event | null>;
	getEventsByCalendar: (calendarId: string) => Event[];
	setError: (error: string | null) => void;
}

export const useEventStore = create<EventStore>()(
	devtools((set, get) => ({
		events: [],
		isLoading: false,
		error: null,

		fetchEvents: async () => {
			set({ isLoading: true, error: null });
			try {
				const events = await fetchEventsAction();
				set({ events });
			} catch (error: any) {
				set({ error: error.message });
			} finally {
				set({ isLoading: false });
			}
		},

		addEvent: async (
			eventData: Omit<Event, "id" | "userId" | "createdAt" | "updatedAt">
		) => {
			set({ isLoading: true, error: null });
			try {
				const newEvent = await createEventAction(eventData);
				set((state) => ({
					events: [...state.events, newEvent],
				}));
			} catch (error: any) {
				set({ error: error.message });
			} finally {
				set({ isLoading: false });
			}
		},

		getEventById: async (id: string): Promise<Event | null> => {
			set({ isLoading: true, error: null });
			try {
				const event = await getEventByIdAction(id);
				return event;
			} catch (error: any) {
				set({ error: error.message });
				return null;
			} finally {
				set({ isLoading: false });
			}
		},

		updateEvent: async (id, updatedData) => {
			set({ isLoading: true, error: null });
			try {
				const updatedEvent = await updateEventAction(id, updatedData);
				set((state) => ({
					events: state.events.map((e) =>
						e.id === id ? { ...e, ...updatedEvent } : e
					),
				}));
			} catch (error: any) {
				set({ error: error.message });
			} finally {
				set({ isLoading: false });
			}
		},

		deleteEvent: async (id) => {
			set({ isLoading: true, error: null });
			try {
				await deleteEventAction(id);
				set((state) => ({
					events: state.events.filter((e) => e.id !== id),
				}));
			} catch (error: any) {
				set({ error: error.message });
			} finally {
				set({ isLoading: false });
			}
		},

		getEventsByCalendar: (calendarId) => {
			const { events } = get();
			return events.filter((e) => e.calendarId === calendarId);
		},

		setError: (error) => set({ error }),
	}))
);
