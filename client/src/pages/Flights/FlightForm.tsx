import {
	Button,
	Group,
	NumberInput,
	Paper,
	Stack,
	Select,
} from "@mantine/core";
import "@mantine/dates/styles.css";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
interface FlightFormProps {
	action: "insert" | "edit" | "view";
	initialValues?: {
		airplane_id: number;
		route_id: number;
		departure_time: Date;
		arrival_time: Date;
		flight_status: string;
	};
	onSubmit?: (values: any) => void;
}

export function FlightForm({
	action,
	initialValues = {
		airplane_id: 0,
		route_id: 0,
		departure_time: new Date(),
		arrival_time: new Date(),
		flight_status: "Flight Status",
	},
	onSubmit = () => {},
	...props
}: FlightFormProps) {
	const form = useForm({
		initialValues,
		validate: {
			airplane_id: (value) => (value > 0 ? null : "Airplane ID is required"),
			route_id: (value) => (value > 0 ? null : "Route ID is required"),
			departure_time: (value) =>
				value ? null : "Possible Departure Time is required",
			arrival_time: (value) =>
				value ? null : "Possible Arrival Time is required",
			flight_status: (value) =>
				["scheduled", "cancelled", "delayed", "completed"].includes(value)
					? null
					: "Flight Status is required",
		},
	});

	const viewOnly = action === "view";

	return (
		<Paper withBorder p="xl" radius="md" {...props}>
			<form onSubmit={form.onSubmit(onSubmit)}>
				<Stack>
					<Group grow>
						<NumberInput
							error={form.errors.airplane_id}
							label="Airplane ID"
							placeholder="Enter airplane ID"
							radius="md"
							readOnly={viewOnly}
							value={form.values.airplane_id}
							onChange={(value) => {
								form.setFieldValue("airplane_id", Number(value));
							}}
						/>
						<NumberInput
							error={form.errors.route_id}
							label="Route ID"
							placeholder="Enter route ID"
							radius="md"
							readOnly={viewOnly}
							value={form.values.route_id}
							onChange={(value) => {
								form.setFieldValue("route_id", Number(value));
							}}
						/>
					</Group>

					<Group grow>
						<DateTimePicker
							label="Departure Time"
							placeholder="Select departure time"
							readOnly={viewOnly}
							value={dayjs(form.values.departure_time).toDate()}
							onChange={(value) => {
								if (value && value instanceof Date) {
									form.setFieldValue("departure_time", value);
								}
							}}
						/>
					</Group>

					<Group grow>
						<DateTimePicker
							label="Arrival Time"
							placeholder="Select arrival time"
							readOnly={viewOnly}
							value={dayjs(form.values.arrival_time).toDate()}
							onChange={(value) => {
								if (value && value instanceof Date) {
									form.setFieldValue("arrival_time", value);
								}
							}}
						/>
					</Group>

					<Group grow>
						<Select
							data={[
								{ value: "scheduled", label: "Scheduled" },
								{ value: "cancelled", label: "Cancelled" },
								{ value: "delayed", label: "Delayed" },
								{ value: "completed", label: "Completed" },
							]}
							error={form.errors.flight_status}
							label="Flight Status"
							placeholder="Select flight status"
							radius="md"
							readOnly={viewOnly}
							value={form.values.flight_status}
							onChange={(value) => {
								if (value) {
									form.setFieldValue("flight_status", value);
								}
							}}
						/>
					</Group>
				</Stack>

				{!viewOnly && (
					<Group mt="xl">
						<Button radius="xl" type="submit">
							Save
						</Button>
					</Group>
				)}
			</form>
		</Paper>
	);
}
