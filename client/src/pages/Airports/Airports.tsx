import { TableAction } from "../../types/enums";
import { TableSort } from "../../components/TableSort/TableSort";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createAirport,
	deleteAirport,
	getAllAirports,
	updateAirport,
	type Airport,
} from "../../api/services/airportService";
import { AirportForm } from "./AirportForm";
import { openDeleteConfirmModal } from "../../components/DeleteConfirmModal/DeleteConfirnModal";

const columns = [
	{ label: "Airport Code", accessor: "airport_code" },
	{ label: "Airport Name", accessor: "airport_name" },
	{ label: "City", accessor: "city" },
	{ label: "State", accessor: "state" },
	{ label: "Country", accessor: "country" },
	{ label: "Image", accessor: "image" },
];

export function Airports() {
	const { data, error, isLoading } = useQuery({
		queryKey: ["airports"],
		queryFn: getAllAirports,
	});

	const queryClient = useQueryClient();

	const handleInsert = async (values: Airport) => {
		await createAirport(values);
		await queryClient.invalidateQueries({
			queryKey: ["airports"],
		});
	};

	const handleEdit = async (values: Airport) => {
		await updateAirport(values);
		await queryClient.invalidateQueries({
			queryKey: ["airports"],
		});
	};

	const handleDelete = async (values: Airport) => {
		await deleteAirport(values.airport_code);
		await queryClient.invalidateQueries({
			queryKey: ["airports"],
		});
	};

	const actions = [
		{
			label: "View",
			tableAction: TableAction.view,
			onClick: (row) => <AirportForm action="view" initialValues={row} />,
		},
		{
			label: "Edit",
			tableAction: TableAction.edit,
			onClick: (row) => (
				<AirportForm action="edit" initialValues={row} onSubmit={handleEdit} />
			),
		},
		{
			label: "Insert",
			tableAction: TableAction.insert,
			onClick: () => <AirportForm action="insert" onSubmit={handleInsert} />,
		},
		{
			label: "Delete",
			tableAction: TableAction.delete,
			onClick: (row) => {
				openDeleteConfirmModal({
					title: "Delete Airport",
					message: `Are you sure you want to delete ${row?.airport_name}?`,
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
			<h1>Airports</h1>
			<TableSort actions={actions} columns={columns} data={data || []} />
		</div>
	);
}
