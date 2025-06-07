"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { calendarSchema, type CalendarFormData } from "@/lib/validations/event";
import {
	useCreateCalendar,
	useUpdateCalendar,
} from "@/actions/query/calendars";
import { useCalendarVisibility } from "@/hooks/use-calendar-visibility";
import { useToast } from "@/hooks/use-toast";
import { CALENDAR_FORM, CALENDAR_COLORS } from "@/constants/colors";
import type { Calendar } from "@/types/calendar";

interface CalendarFormProps {
	calendar?: Calendar;
	onSuccess?: () => void;
	onCancel?: () => void;
}

export default function CalendarForm({
	calendar,
	onSuccess,
	onCancel,
}: CalendarFormProps) {
	const { toast } = useToast();
	const createCalendarMutation = useCreateCalendar();
	const updateCalendarMutation = useUpdateCalendar();
	const { setCalendarVisibility } = useCalendarVisibility();

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<CalendarFormData>({
		resolver: zodResolver(calendarSchema),
		defaultValues: {
			name: "",
			description: "",
			color: CALENDAR_COLORS[0],
			is_visible: true,
		},
	});

	useEffect(() => {
		if (calendar) {
			reset({
				name: calendar.name || "",
				description: calendar.description || "",
				color: calendar.color || CALENDAR_COLORS[0],
				is_visible: calendar.is_visible ?? true,
			});
		} else {
			reset({
				name: "",
				description: "",
				color: CALENDAR_COLORS[0],
				is_visible: true,
			});
		}
	}, [calendar, reset]);

	const onSubmit = async (data: CalendarFormData) => {
		try {
			if (calendar?.id) {
				await updateCalendarMutation.mutateAsync({
					id: calendar.id,
					calendarData: data,
				});
				setCalendarVisibility(calendar.id, data.is_visible);
				toast({
					title: "Calendar updated",
					description: "Your calendar has been updated successfully.",
				});
			} else {
				const newCalendar = await createCalendarMutation.mutateAsync({
					...data,
					description: data.description ?? "",
				});
				if (data.is_visible && newCalendar.id) {
					setCalendarVisibility(newCalendar.id, true);
				}
				toast({
					title: "Calendar created",
					description: "Your calendar has been created successfully.",
				});
			}
			onSuccess?.();
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error ? error.message : "Failed to save calendar",
				variant: "destructive",
			});
		}
	};

	const isPending =
		createCalendarMutation.isPending || updateCalendarMutation.isPending;

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="name">{CALENDAR_FORM.FIELDS.NAME.LABEL} *</Label>
				<Input
					id="name"
					{...register("name")}
					className={errors.name ? "border-destructive" : ""}
					placeholder={CALENDAR_FORM.FIELDS.NAME.PLACEHOLDER}
				/>
				{errors.name && (
					<p className="text-sm text-destructive">{errors.name.message}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">
					{CALENDAR_FORM.FIELDS.DESCRIPTION.LABEL}
				</Label>
				<Textarea
					id="description"
					{...register("description")}
					rows={2}
					placeholder={CALENDAR_FORM.FIELDS.DESCRIPTION.PLACEHOLDER}
				/>
			</div>

			<div className="space-y-2">
				<Label>Calendar Color</Label>
				<div className="flex space-x-2">
					{CALENDAR_COLORS.map((color) => (
						<Controller
							key={color}
							name="color"
							control={control}
							render={({ field }) => (
								<button
									type="button"
									className={`w-8 h-8 rounded-full border-2 transition-all ${
										field.value === color
											? "border-foreground scale-110"
											: "border-border hover:scale-105"
									}`}
									style={{ backgroundColor: color }}
									onClick={() => field.onChange(color)}
								/>
							)}
						/>
					))}
				</div>
			</div>

			<div className="flex justify-end space-x-2 pt-4 border-t">
				<Button type="button" variant="outline" onClick={onCancel}>
					{CALENDAR_FORM.BUTTONS.CANCEL}
				</Button>
				<Button type="submit" disabled={isSubmitting || isPending}>
					{isSubmitting || isPending
						? CALENDAR_FORM.BUTTONS.SAVING
						: calendar?.id
							? CALENDAR_FORM.BUTTONS.UPDATE
							: CALENDAR_FORM.BUTTONS.CREATE}
				</Button>
			</div>
		</form>
	);
}
