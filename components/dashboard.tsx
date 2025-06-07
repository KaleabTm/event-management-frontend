"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import DashboardLayout from "./shared/layout/dashboard-layout";
import CalendarSidebar from "./shared/navigations/calendar-sidebar";
import CalendarView from "./calendar-view";
import ListView from "./list-view";
import EventModal from "./modals/event-modal";
import { Plus } from "lucide-react";
import { DASHBOARD_PAGE } from "@/constants/colors";

export default function Dashboard() {
	const [isEventModalOpen, setIsEventModalOpen] = useState(false);
	const [editingEvent, setEditingEvent] = useState(null);

	const handleCreateEvent = () => {
		setEditingEvent(null);
		setIsEventModalOpen(true);
	};

	const handleEditEvent = (event: any) => {
		setEditingEvent(event);
		setIsEventModalOpen(true);
	};

	return (
		<DashboardLayout>
			<div className="flex gap-6">
				{/* Calendar Sidebar */}
				<CalendarSidebar />

				{/* Main Content Area */}
				<div className="flex-1 space-y-6">
					<div className="flex justify-between items-center">
						<h2 className="text-3xl font-bold tracking-tight">
							{DASHBOARD_PAGE.SECTIONS.HEADER}
						</h2>
						<Button onClick={handleCreateEvent} className="flex items-center">
							<Plus className="h-4 w-4 mr-2" />
							Create Event
						</Button>
					</div>

					<Tabs defaultValue="calendar" className="space-y-6">
						<TabsContent value="calendar" className="space-y-4">
							<CalendarView onEditEvent={handleEditEvent} />
						</TabsContent>

						<TabsContent value="list" className="space-y-4">
							<ListView onEditEvent={handleEditEvent} />
						</TabsContent>
					</Tabs>
				</div>
			</div>

			{/* Event Modal */}
			<EventModal
				isOpen={isEventModalOpen}
				onClose={() => setIsEventModalOpen(false)}
				event={editingEvent}
			/>
		</DashboardLayout>
	);
}
