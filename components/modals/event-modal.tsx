"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import EventForm from "@/components/forms/event-form";

interface EventModalProps {
	isOpen: boolean;
	onClose: () => void;
	event?: any;
}

export default function EventModal({
	isOpen,
	onClose,
	event,
}: EventModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{event?.id ? "Edit Event" : "Create New Event"}</DialogTitle>
				</DialogHeader>
				<EventForm event={event} onSuccess={onClose} onCancel={onClose} />
			</DialogContent>
		</Dialog>
	);
}
