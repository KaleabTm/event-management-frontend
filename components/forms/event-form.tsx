"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { eventSchema, type EventFormData } from "@/lib/validations/event";
import { useCreateEvent, useUpdateEvent } from "@/actions/query/events";
import { useCalendars } from "@/actions/query/calendars";
import { useToast } from "@/hooks/use-toast";
import { exportSingleEvent } from "@/lib/ics-export";
import { Download } from "lucide-react";
import { EVENT_FORM, CALENDAR_COLORS, WEEKDAYS } from "@/constants/colors";

interface EventFormProps {
	event?: any;
	calendars?: any[];
	onSuccess: () => void;
	onCancel: () => void;
}

export default function EventForm({
	event,
	onSuccess,
	onCancel,
}: EventFormProps) {
	const { toast } = useToast();
	const { data: calendars = [] } = useCalendars();
	const createEventMutation = useCreateEvent();
	const updateEventMutation = useUpdateEvent();

	const {
		register,
		handleSubmit,
		control,
		watch,
		setValue,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<EventFormData>({
		resolver: zodResolver(eventSchema),
		defaultValues: {
			title: "",
			description: "",
			start: new Date().toISOString().slice(0, 16),
			end: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
			allDay: false,
			color: CALENDAR_COLORS[0],
			calendarId: "",
			recurrence: {
				type: "none",
				interval: 1,
				weekdays: [],
				monthlyType: "date",
				weekdayOrdinal: 1,
				endAfter: 10,
			},
		},
	});

	const watchAllDay = watch("allDay");
	const watchRecurrenceType = watch("recurrence.type");

	useEffect(() => {
		if (event) {
			reset({
				title: event.title || "",
				description: event.description || "",
				start: event.start
					? new Date(event.start).toISOString().slice(0, 16)
					: new Date().toISOString().slice(0, 16),
				end: event.end
					? new Date(event.end).toISOString().slice(0, 16)
					: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
				allDay: event.allDay || false,
				color: event.color || CALENDAR_COLORS[0],
				calendarId: event.calendarId || calendars[0]?.id || "",
				recurrence: event.recurrence || {
					type: "none",
					interval: 1,
					weekdays: [],
					monthlyType: "date",
					weekdayOrdinal: 1,
					endAfter: 10,
				},
			});
		} else {
			reset({
				title: "",
				description: "",
				start: new Date().toISOString().slice(0, 16),
				end: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
				allDay: false,
				color: CALENDAR_COLORS[0],
				calendarId: calendars[0]?.id || "",
				recurrence: {
					type: "none",
					interval: 1,
					weekdays: [],
					monthlyType: "date",
					weekdayOrdinal: 1,
					endAfter: 10,
				},
			});
		}
	}, [event, reset, calendars]);

	const onSubmit = async (data: EventFormData) => {
		try {
			if (event?.id) {
				await updateEventMutation.mutateAsync({ id: event.id, eventData: data });
				toast({
					title: "Event updated",
					description: "Your event has been updated successfully.",
				});
			} else {
				await createEventMutation.mutateAsync(data);
				toast({
					title: "Event created",
					description: "Your event has been created successfully.",
				});
			}
			onSuccess?.();
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error ? error.message : "Failed to save event",
				variant: "destructive",
			});
		}
	};

	const isPending =
		createEventMutation.isPending || updateEventMutation.isPending;

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			{/* Basic Information */}
			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="title">{EVENT_FORM.FIELDS.TITLE.LABEL} *</Label>
					<Input
						id="title"
						placeholder={EVENT_FORM.FIELDS.TITLE.PLACEHOLDER}
						{...register("title")}
						className={errors.title ? "border-destructive" : ""}
					/>
					{errors.title && (
						<p className="text-sm text-destructive">{errors.title.message}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="description">{EVENT_FORM.FIELDS.DESCRIPTION.LABEL}</Label>
					<Textarea
						id="description"
						placeholder={EVENT_FORM.FIELDS.DESCRIPTION.PLACEHOLDER}
						{...register("description")}
						rows={3}
					/>
				</div>

				<div className="space-y-2">
					<Label>{EVENT_FORM.FIELDS.CALENDAR.LABEL} *</Label>
					<Controller
						name="calendarId"
						control={control}
						render={({ field }) => (
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger
									className={errors.calendarId ? "border-destructive" : ""}
								>
									<SelectValue placeholder={EVENT_FORM.FIELDS.CALENDAR.PLACEHOLDER} />
								</SelectTrigger>
								<SelectContent>
									{calendars.map((calendar) => (
										<SelectItem key={calendar.id} value={calendar.id}>
											<div className="flex items-center space-x-2">
												<div
													className="w-3 h-3 rounded-full"
													style={{ backgroundColor: calendar.color }}
												/>
												<span>{calendar.name}</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
					{errors.calendarId && (
						<p className="text-sm text-destructive">{errors.calendarId.message}</p>
					)}
				</div>
			</div>

			{/* All Day Toggle */}
			<div className="flex items-center space-x-2">
				<Controller
					name="allDay"
					control={control}
					render={({ field }) => (
						<Switch
							id="allDay"
							checked={field.value}
							onCheckedChange={field.onChange}
						/>
					)}
				/>
				<Label htmlFor="allDay">{EVENT_FORM.FIELDS.ALL_DAY.LABEL}</Label>
			</div>

			{/* Date and Time */}
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="start">
						{EVENT_FORM.FIELDS.START_DATE.LABEL}{" "}
						{watchAllDay ? "(Date)" : "(Date & Time)"} *
					</Label>
					<Input
						id="start"
						type={watchAllDay ? "date" : "datetime-local"}
						{...register("start")}
						className={errors.start ? "border-destructive" : ""}
					/>
					{errors.start && (
						<p className="text-sm text-destructive">{errors.start.message}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="end">
						{EVENT_FORM.FIELDS.END_DATE.LABEL}{" "}
						{watchAllDay ? "(Date)" : "(Date & Time)"} *
					</Label>
					<Input
						id="end"
						type={watchAllDay ? "date" : "datetime-local"}
						{...register("end")}
						className={errors.end ? "border-destructive" : ""}
					/>
					{errors.end && (
						<p className="text-sm text-destructive">{errors.end.message}</p>
					)}
				</div>
			</div>

			{/* Color Selection */}
			<div className="space-y-2">
				<Label>{EVENT_FORM.FIELDS.COLOR.LABEL}</Label>
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

			{/* Recurrence Settings */}
			<div className="space-y-4">
				<div className="space-y-2">
					<Label>{EVENT_FORM.FIELDS.RECURRENCE.LABEL}</Label>
					<Controller
						name="recurrence.type"
						control={control}
						render={({ field }) => (
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Object.entries(EVENT_FORM.FIELDS.RECURRENCE.OPTIONS).map(
										([key, option]) => (
											<SelectItem key={key} value={option.value}>
												{option.label}
											</SelectItem>
										)
									)}
								</SelectContent>
							</Select>
						)}
					/>
				</div>

				{watchRecurrenceType !== "none" && watchRecurrenceType !== "custom" && (
					<div className="space-y-2">
						<Label htmlFor="interval">Repeat Every</Label>
						<div className="flex items-center space-x-2">
							<Input
								id="interval"
								type="number"
								min="1"
								max="365"
								{...register("recurrence.interval", { valueAsNumber: true })}
								className="w-20"
							/>
							<span className="text-sm text-muted-foreground">
								{watchRecurrenceType === "daily" && "day(s)"}
								{watchRecurrenceType === "weekly" && "week(s)"}
								{watchRecurrenceType === "monthly" && "month(s)"}
								{watchRecurrenceType === "yearly" && "year(s)"}
							</span>
						</div>
					</div>
				)}

				{watchRecurrenceType === "custom" && (
					<div className="space-y-2">
						<Label>Days of the Week</Label>
						<div className="grid grid-cols-2 gap-2">
							{WEEKDAYS.map((day) => (
								<Controller
									key={day.value}
									name="recurrence.weekdays"
									control={control}
									render={({ field }) => (
										<div className="flex items-center space-x-2">
											<Checkbox
												id={`weekday-${day.value}`}
												checked={field.value.includes(day.value)}
												onCheckedChange={(checked) => {
													if (checked) {
														field.onChange([...field.value, day.value]);
													} else {
														field.onChange(
															field.value.filter((d: number) => d !== day.value)
														);
													}
												}}
											/>
											<Label htmlFor={`weekday-${day.value}`} className="text-sm">
												{day.label}
											</Label>
										</div>
									)}
								/>
							))}
						</div>
					</div>
				)}

				{watchRecurrenceType === "monthly" && (
					<div className="space-y-2">
						<Label>Monthly Recurrence Type</Label>
						<Controller
							name="recurrence.monthlyType"
							control={control}
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="date">Same date each month</SelectItem>
										<SelectItem value="weekday">Same weekday each month</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>
				)}
			</div>

			{/* Form Actions */}
			<div className="flex justify-between items-center pt-4 border-t">
				{event?.id && (
					<Button
						type="button"
						variant="outline"
						onClick={() => {
							const eventData = { ...event, ...watch() };
							exportSingleEvent(eventData);
							toast({
								title: "Event exported",
								description: "Event has been exported successfully.",
							});
						}}
						className="flex items-center"
					>
						<Download className="h-4 w-4 mr-2" />
						{EVENT_FORM.BUTTONS.EXPORT}
					</Button>
				)}
				<div className="flex space-x-2 ml-auto">
					<Button type="button" variant="outline" onClick={onCancel}>
						{EVENT_FORM.BUTTONS.CANCEL}
					</Button>
					<Button type="submit" disabled={isSubmitting || isPending}>
						{isSubmitting || isPending
							? EVENT_FORM.BUTTONS.SAVING
							: event?.id
								? EVENT_FORM.BUTTONS.UPDATE
								: EVENT_FORM.BUTTONS.CREATE}
					</Button>
				</div>
			</div>
		</form>
	);
}
