import { Button, Group, Paper, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

interface AirportFormProps {
	action: "insert" | "edit" | "view";
	initialValues?: {
		airport_code: string;
		airport_name: string;
		city: string;
		state: string;
		country: string;
		image_url: string;
	};
	onSubmit?: (values: any) => void;
}

export function AirportForm({
	action,
	initialValues = {
		airport_code: "",
		airport_name: "",
		city: "",
		state: "",
		country: "",
		image_url: "",
	},
	onSubmit = () => {},
	...props
}: AirportFormProps) {
	const form = useForm({
		initialValues,
		validate: {
			airport_code: (value) => (value ? null : "Airport Code is required"),
			airport_name: (value) => (value ? null : "Airport Name is required"),
			city: (value) => (value ? null : "City is required"),
			state: (value) => (value ? null : "State is required"),
			country: (value) => (value ? null : "Country is required"),
			image_url: (value) => (value ? null : "Image URL is required"),
		},
	});

	const viewOnly = action === "view";

	return (
		<Paper withBorder p="xl" radius="md" {...props}>
			<form onSubmit={form.onSubmit(onSubmit)}>
				<Stack>
					<Group grow>
						<TextInput
							readOnly
							error={form.errors.airport_code}
							label="Airport Code"
							placeholder="Airport Code"
							radius="md"
							value={form.values.airport_code}
						/>
					</Group>
					<Group>
						<TextInput
							label="Airport Name"
							placeholder="Airport Name"
							radius="md"
							readOnly={viewOnly}
							value={form.values.airport_name}
							onChange={(event) => {
								form.setFieldValue("airport_name", event.currentTarget.value);
							}}
						/>
					</Group>
					<Group grow>
						<TextInput
							label="City"
							placeholder="City"
							radius="md"
							readOnly={viewOnly}
							value={form.values.city}
							onChange={(event) => {
								form.setFieldValue("city", event.currentTarget.value);
							}}
						/>
						<TextInput
							label="State"
							placeholder="State"
							radius="md"
							readOnly={viewOnly}
							value={form.values.state}
							onChange={(event) => {
								form.setFieldValue("state", event.currentTarget.value);
							}}
						/>
						<TextInput
							label="Country"
							placeholder="Country"
							radius="md"
							readOnly={viewOnly}
							value={form.values.country}
							onChange={(event) => {
								form.setFieldValue("country", event.currentTarget.value);
							}}
						/>
					</Group>
					<Group grow>
						<TextInput
							label="Image URL"
							placeholder="Image URL"
							radius="md"
							readOnly={viewOnly}
							value={form.values.image_url}
							onChange={(event) => {
								form.setFieldValue("image_url", event.currentTarget.value);
							}}
						/>
					</Group>
					{!viewOnly && (
						<Group mt="xl">
							<Button radius="xl" type="submit">
								Save
							</Button>
						</Group>
					)}
				</Stack>
			</form>
		</Paper>
	);
}
