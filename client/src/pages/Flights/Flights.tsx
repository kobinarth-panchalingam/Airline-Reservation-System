import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createFlight,
	deleteFlight,
	getAllFlights,
	updateFlight,
	type Flight,
} from "../../api/services/flightService";
import { FlightForm } from "./FlightForm";
import { openDeleteConfirmModal } from "../../components/DeleteConfirmModal/DeleteConfirmModal";
import { TableAction } from "../../types/enums";
import { TableSort } from "../../components/TableSort/TableSort";

const columns = [
	{ label: "Airplane ID", accessor: "airplane_id" },
	{ label: "Route ID", accessor: "route_id" },
	{ label: "Departure Time", accessor: "departure_time" },
	{ label: "Arrival Time", accessor: "arrival_time" },
	{ label: "Flight Status", accessor: "flight_status" },
];

export function Flights() {
	const { data, error, isLoading } = useQuery({
		queryKey: ["flights"],
		queryFn: getAllFlights,
	});

	const queryClient = useQueryClient();

	const handleInsert = async (values: Flight) => {
		await createFlight(values);
		await queryClient.invalidateQueries({
			queryKey: ["flights"],
		});
	};

	const handleEdit = async (values: Flight) => {
		await updateFlight(values);
		await queryClient.invalidateQueries({
			queryKey: ["flights"],
		});
	};

	const handleDelete = async (values: Flight) => {
		await deleteFlight(values.id);
		await queryClient.invalidateQueries({
			queryKey: ["flights"],
		});
	};

	const actions = [
		{
			label: "View",
			tableAction: TableAction.view,
			onClick: (row) => <FlightForm action="view" initialValues={row} />,
		},
		{
			label: "Edit",
			tableAction: TableAction.edit,
			onClick: (row) => (
				<FlightForm action="edit" initialValues={row} onSubmit={handleEdit} />
			),
		},
		{
			label: "Insert",
			tableAction: TableAction.insert,
			onClick: () => <FlightForm action="insert" onSubmit={handleInsert} />,
		},
		{
			label: "Delete",
			tableAction: TableAction.delete,
			onClick: (row) => {
				openDeleteConfirmModal({
					title: "Delete Flight",
					message: `Are you sure you want to delete the flight ${row?.id}?`,
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
			<TableSort actions={actions} columns={columns} data={data || []} />
		</div>
	);
}
