import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createAircraftModel,
	deleteAircraftModel,
	getAllAircraftModels,
	updateAircraftModel,
} from "../../api/services/aircraftModelService";
import { TableSort } from "../../components/TableSort/TableSort";
import { AircraftModelForm } from "./AircraftModelForm";
import { openDeleteConfirmModal } from "../../utls/DeleteConfirnModal";

const columns = [
	{ label: "Model Name", accessor: "model_name" },
	{ label: "Variant", accessor: "variant" },
	{ label: "Manufacturer Name", accessor: "manufacturer_name" },
	{ label: "Seat Capacity", accessor: "seat_capacity" },
	{ label: "Max Load (kg)", accessor: "max_load" },
	{ label: "Fuel Capacity (l)", accessor: "fuel_capacity" },
	{ label: "Average Speed (km/h)", accessor: "average_speed" },
];

export function AircraftModels() {
	const { data, error, isLoading } = useQuery({
		queryKey: ["aircraftModels"],
		queryFn: getAllAircraftModels,
	});

	const queryClient = useQueryClient();

	const handleInsert = async (values) => {
		await createAircraftModel(values);
		await queryClient.invalidateQueries({
			queryKey: ["aircraftModels"],
		});
	};

	const handleEdit = async (values) => {
		await updateAircraftModel(values);
		await queryClient.invalidateQueries({
			queryKey: ["aircraftModels"],
		});
	};

	const handleDelete = async (values) => {
		await deleteAircraftModel(values.id);
		await queryClient.invalidateQueries({
			queryKey: ["aircraftModels"],
		});
	};

	const actions = [
		{
			label: "View",
			type: "view",
			onClick: (row) => <AircraftModelForm action="view" initialValues={row} />,
		},
		{
			label: "Edit",
			type: "edit",
			onClick: (row) => (
				<AircraftModelForm
					action="edit"
					initialValues={row}
					onSubmit={handleEdit}
				/>
			),
		},
		{
			label: "Insert",
			type: "insert",
			onClick: () => (
				<AircraftModelForm action="insert" onSubmit={handleInsert} />
			),
		},
		{
			label: "Delete",
			type: "delete",
			onClick: (row) => {
				openDeleteConfirmModal({
					title: "Delete Aircraft Model",
					message: `Are you sure you want to delete the aircraft model ${row.model_name}? This action is irreversible.`,
					onConfirm: () => handleDelete(row),
				});
			},
		},
	];

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div>
			<TableSort actions={actions} columns={columns} data={data} />
		</div>
	);
}
