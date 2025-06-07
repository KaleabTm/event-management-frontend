"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import CalendarForm from "@/components/forms/calendar-form";

interface CalendarModalProps {
	isOpen: boolean;
	onClose: () => void;
	calendar?: any;
}

export default function CalendarModal({
	isOpen,
	onClose,
	calendar,
}: CalendarModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>
						{calendar?.id ? "Edit Calendar" : "Create New Calendar"}
					</DialogTitle>
				</DialogHeader>
				<CalendarForm calendar={calendar} onSuccess={onClose} onCancel={onClose} />
			</DialogContent>
		</Dialog>
	);
}
