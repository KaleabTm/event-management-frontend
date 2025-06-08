"use client";

import { useFetchMe } from "@/actions/query/auth";
import { useCalendars } from "@/actions/query/calendars";
import { useCreateEvent, useUpdateEvent } from "@/actions/query/events";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CALENDAR_COLORS, EVENT_FORM, WEEKDAYS } from "@/constants/colors";
import { useToast } from "@/hooks/use-toast";
import { exportSingleEvent } from "@/lib/ics-export";
import { eventSchema, type EventFormData } from "@/lib/validations/event";
import type { Calendar } from "@/types/calendar";
import type { CreateEventInput } from "@/types/event";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Download } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Calendar as CalendarUI } from "@/components/ui/calendar";

interface EventFormProps {
	event?: any;
	calendars?: Calendar[];
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
	const user = useFetchMe(true);

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
			start_time: new Date().toISOString().slice(0, 16),
			end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
			is_all_day: false,
			color: CALENDAR_COLORS[0],
			calendarId: calendars[0]?.id || "",
			recurrence: {
				frequency: "none",
				interval: 1,
				weekdays: [],
				monthly_type: "date",
				weekday_ordinal: 1,
				repeat_count: 10,
			},
		},
	});

	const watchAllDay = watch("is_all_day");
	const watchRecurrenceType = watch("recurrence.frequency");
	useEffect(() => {
		if (event) {
			reset({
				title: event.title || "",
				description: event.description || "",
				start_time: event.start_time
					? new Date(event.start_time).toISOString().slice(0, 16)
					: new Date().toISOString().slice(0, 16),
				end_time: event.end_time
					? new Date(event.end_time).toISOString().slice(0, 16)
					: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
				is_all_day: event.is_all_day || false,
				color: event.color || CALENDAR_COLORS[0],
				calendarId: event.calendar?.id || calendars[0]?.id || "",
				recurrence: event.recurrence || {
					frequency: "none",
					interval: 1,
					weekdays: [],
					monthly_type: "date",
					weekday_ordinal: 1,
					repeat_count: 10,
				},
			});
		} else {
			reset({
				title: "",
				description: "",
				start_time: new Date().toISOString().slice(0, 16),
				end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
				is_all_day: false,
				color: CALENDAR_COLORS[0],
				calendarId: calendars[0]?.id || "",
				recurrence: {
					frequency: "none",
					interval: 1,
					weekdays: [],
					monthly_type: "date",
					weekday_ordinal: 1,
					repeat_count: 10,
				},
			});
		}
	}, [event, reset, calendars]);

	const onSubmit = async (data: EventFormData) => {
		try {
			if (event?.id) {
				const { calendarId, recurrence, ...rest } = data;

				const payload: CreateEventInput = {
					...rest,
					calendar_id: calendarId,
					frequency: recurrence.frequency,
					interval: recurrence.interval,
					weekdays: recurrence.weekdays?.map(String), // convert to string[] if needed
					weekday_ordinal: recurrence.weekday_ordinal,
					end_date: recurrence.end_date,
					repeat_count: recurrence.repeat_count,
				};
				await updateEventMutation.mutateAsync({ id: event.id, eventData: payload });
				toast({
					title: "Event updated",
					description: "Your event has been updated successfully.",
				});
			} else {
				const {
					recurrence, // contains frequency, interval, weekdays, etc.
					calendarId, // camelCase from form
					...rest // the rest of the fields like title, color, etc.
				} = data;

				const payload: CreateEventInput = {
					...rest,
					calendar_id: calendarId,
					...{
						...recurrence,
						weekdays: recurrence.weekdays?.map(String), // <== fix here
					},
				};
				// adapt to your auth method
				if (!user) {
					toast({
						title: "Error",
						description: "User not logged in",
						variant: "destructive",
					});
					return;
				}
				await createEventMutation.mutateAsync(payload);

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
					name="is_all_day"
					control={control}
					render={({ field }) => (
						<Switch
							id="is_all_day"
							checked={field.value}
							onCheckedChange={field.onChange}
						/>
					)}
				/>
				<Label htmlFor="is_all_day">{EVENT_FORM.FIELDS.ALL_DAY.LABEL}</Label>
			</div>

			<div className="grid grid-cols-2 gap-4">
				{/* Start Time */}
				<div className="space-y-2">
					<Label htmlFor="start_time">
						{EVENT_FORM.FIELDS.START_DATE.LABEL}{" "}
						{watchAllDay ? "(Date)" : "(Date & Time)"} *
					</Label>
					<Controller
						control={control}
						name="start_time"
						render={({ field }) => {
							// Convert ISO string to Date or fallback to now
							const valueDate = field.value ? new Date(field.value) : new Date();

							return (
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className={`w-full pl-3 text-left font-normal ${
												errors.start_time ? "border-destructive" : ""
											}`}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{watchAllDay
												? format(valueDate, "yyyy-MM-dd")
												: format(valueDate, "yyyy-MM-dd HH:mm")}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<CalendarUI
											mode={watchAllDay ? "single" : "single"}
											selected={valueDate}
											onSelect={(date: Date | undefined) => {
												if (!date) return;
												// If all day, reset time to 00:00
												if (watchAllDay) {
													date.setHours(0, 0, 0, 0);
													// for end_time, might want to handle differently (e.g. +1 day - 1ms)
												}
												field.onChange(date.toISOString());
											}}
											// show time selector only if not all day, use a custom time picker or external library for time selection if needed
											// Shadcn Calendar does not support time by default, so we need a workaround:
											// For full datetime support, combine with an Input of type time or a third-party time picker
										/>
										{!watchAllDay && (
											<input
												type="time"
												className="w-full border-t px-2 py-1 outline-none"
												value={format(valueDate, "HH:mm")}
												onChange={(e) => {
													const [hours, minutes] = e.target.value.split(":");
													const newDate = new Date(valueDate);
													newDate.setHours(Number(hours), Number(minutes));
													field.onChange(newDate.toISOString());
												}}
											/>
										)}
									</PopoverContent>
								</Popover>
							);
						}}
					/>
					{errors.start_time && (
						<p className="text-sm text-destructive">{errors.start_time.message}</p>
					)}
				</div>

				{/* End Time */}
				<div className="space-y-2">
					<Label htmlFor="end_time">
						{EVENT_FORM.FIELDS.END_DATE.LABEL}{" "}
						{watchAllDay ? "(Date)" : "(Date & Time)"} *
					</Label>
					<Controller
						control={control}
						name="end_time"
						render={({ field }) => {
							const valueDate = field.value
								? new Date(field.value)
								: new Date(Date.now() + 60 * 60 * 1000);
							return (
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className={`w-full pl-3 text-left font-normal ${
												errors.end_time ? "border-destructive" : ""
											}`}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{watchAllDay
												? format(valueDate, "yyyy-MM-dd")
												: format(valueDate, "yyyy-MM-dd HH:mm")}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<CalendarUI
											mode="single"
											selected={valueDate}
											onSelect={(date) => {
												if (!date) return;
												if (watchAllDay) {
													date.setHours(0, 0, 0, 0);
												}
												field.onChange(date.toISOString());
											}}
										/>
										{!watchAllDay && (
											<input
												type="time"
												className="w-full border-t px-2 py-1 outline-none"
												value={format(valueDate, "HH:mm")}
												onChange={(e) => {
													const [hours, minutes] = e.target.value.split(":");
													const newDate = new Date(valueDate);
													newDate.setHours(Number(hours), Number(minutes));
													field.onChange(newDate.toISOString());
												}}
											/>
										)}
									</PopoverContent>
								</Popover>
							);
						}}
					/>
					{errors.end_time && (
						<p className="text-sm text-destructive">{errors.end_time.message}</p>
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
						name="recurrence.frequency"
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
							name="recurrence.monthly_type"
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
