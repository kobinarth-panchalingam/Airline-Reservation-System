import {
	Button,
	Group,
	NumberInput,
	Paper,
	Stack,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

interface AircraftModelFormProps {
	action: "insert" | "edit" | "view";
	initialValues?: {
		model_name: string;
		variant: string;
		manufacturer_name: string;
		seat_capacity: number;
		max_load: number;
		fuel_capacity: number;
		average_speed: number;
	};
	onSubmit?: (values: any) => void;
}

export function AircraftModelForm({
	action,
	initialValues = {
		model_name: "",
		variant: "",
		manufacturer_name: "",
		seat_capacity: 0,
		max_load: 0,
		fuel_capacity: 0,
		average_speed: 0,
	},
	onSubmit = () => {},
	...props
}: AircraftModelFormProps) {
	const form = useForm({
		initialValues,
		validate: {
			model_name: (value) => (value ? null : "Model Name is required"),
			variant: (value) => (value ? null : "Variant is required"),
			manufacturer_name: (value) =>
				value ? null : "Manufacturer Name is required",
			seat_capacity: (value) =>
				value > 0 ? null : "Seat Capacity must be greater than 0",
			max_load: (value) =>
				value > 0 ? null : "Max Load must be greater than 0",
			fuel_capacity: (value) =>
				value > 0 ? null : "Fuel Capacity must be greater than 0",
			average_speed: (value) =>
				value > 0 ? null : "Average Speed must be greater than 0",
		},
	});

	const viewOnly = action === "view";

	return (
		<Paper withBorder p="xl" radius="md" {...props}>
			<form onSubmit={form.onSubmit(onSubmit)}>
				<Stack>
					<Group grow>
						<TextInput
							error={form.errors.model_name}
							label="Model Name"
							placeholder="Model Name"
							radius="md"
							readOnly={viewOnly}
							value={form.values.model_name}
							onChange={(event) => {
								form.setFieldValue("model_name", event.currentTarget.value);
							}}
						/>
						<TextInput
							error={form.errors.variant}
							label="Variant"
							placeholder="Variant"
							radius="md"
							readOnly={viewOnly}
							value={form.values.variant}
							onChange={(event) => {
								form.setFieldValue("variant", event.currentTarget.value);
							}}
						/>
					</Group>

					<TextInput
						error={form.errors.manufacturer_name}
						label="Manufacturer Name"
						placeholder="Manufacturer Name"
						radius="md"
						readOnly={viewOnly}
						value={form.values.manufacturer_name}
						onChange={(event) => {
							form.setFieldValue(
								"manufacturer_name",
								event.currentTarget.value
							);
						}}
					/>

					<Group grow>
						<NumberInput
							error={form.errors.seat_capacity}
							label="Seat Capacity"
							min={0}
							placeholder="Seat Capacity"
							radius="md"
							readOnly={viewOnly}
							value={form.values.seat_capacity}
							onChange={(value) => {
								form.setFieldValue("seat_capacity", Number(value));
							}}
						/>
						<NumberInput
							error={form.errors.max_load}
							label="Max Load (kg)"
							min={0}
							placeholder="Max Load (kg)"
							radius="md"
							readOnly={viewOnly}
							value={form.values.max_load}
							onChange={(value) => {
								form.setFieldValue("max_load", Number(value));
							}}
						/>
					</Group>

					<Group grow>
						<NumberInput
							error={form.errors.fuel_capacity}
							label="Fuel Capacity (l)"
							min={0}
							placeholder="Fuel Capacity (l)"
							radius="md"
							readOnly={viewOnly}
							value={form.values.fuel_capacity}
							onChange={(value) => {
								form.setFieldValue("fuel_capacity", Number(value));
							}}
						/>
						<NumberInput
							error={form.errors.average_speed}
							label="Average Speed (km/h)"
							min={0}
							placeholder="Average Speed (km/h)"
							radius="md"
							readOnly={viewOnly}
							value={form.values.average_speed}
							onChange={(value) => {
								form.setFieldValue("average_speed", Number(value));
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
