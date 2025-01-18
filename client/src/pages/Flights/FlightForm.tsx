import {
	Button,
	Group,
	NumberInput,
	Paper,
	Stack,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
// import { DateInput } from "@mantine/dates";
// import dayjs from "dayjs";
// import customParseFormat from "dayjs/plugin/customParseFormat";
// It is required to extend dayjs with customParseFormat plugin
// in order to parse dates with custom format
// dayjs.extend(customParseFormat);

interface FlightFormProps {
	action: "insert" | "edit" | "view";
	initialValues?: {
		airplane_id: number;
		route_id: number;
		departure_time: string;
		arrival_time: string;
		flight_status: string;
	};
	onSubmit?: (values: any) => void;
}

export function FlightForm({
	action,
	initialValues = {
		airplane_id: 0,
		route_id: 0,
		departure_time: "2025-02-21T03:30:00.000Z",
		arrival_time: "2025-02-01T03:30:00.000Z",
		flight_status: "scheduled",
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
						<TextInput
							error={form.errors.departure_time}
							label="Date input"
							placeholder="Date input"
							radius="md"
							readOnly={viewOnly}
							value={form.values.departure_time}
							onChange={(event) => {
								if (event) {
									form.setFieldValue(
										"departure_time",
										event.currentTarget.value
									);
								}
							}}
						/>
					</Group>
					<Group grow>
						<TextInput
							error={form.errors.arrival_time}
							label="Arrival Time"
							placeholder="Enter arrival time"
							radius="md"
							readOnly={viewOnly}
							value={form.values.arrival_time}
							onChange={(event) => {
								if (event) {
									form.setFieldValue("arrival_time", event.currentTarget.value);
								}
							}}
						/>
					</Group>

					<Group grow>
						<TextInput
							error={form.errors.flight_status}
							label="Flight Status"
							placeholder="Select flight status"
							radius="md"
							readOnly={viewOnly}
							value={form.values.flight_status}
							onChange={(event) => {
								form.setFieldValue("flight_status", event.currentTarget.value);
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
