import { TableSort } from "../../components/TableSort/TableSort";

const data = [
	{
		name: "John Doe",
		email: "john@example.com",
		company: "Example Inc.",
		salary: 100000,
	},
	{
		name: "Jane Smith",
		email: "jane@example.com",
		company: "Example LLC",
		salary: undefined,
	},
	{
		name: "Alice Johnson",
		email: "alice@example.com",
		company: "Example Corp.",
		salary: 95000,
	},
	{
		name: "Bob Brown",
		email: "bob@example.com",
		company: "Example Ltd.",
		salary: 85000,
	},
	{
		name: "Charlie Davis",
		email: "charlie@example.com",
		company: "Example Group",
		salary: 105000,
	},
	{
		name: "Diana Evans",
		email: "diana@example.com",
		company: "Example Partners",
		salary: 98000,
	},
];

const columns = [
	{ label: "Name", accessor: "name" },
	{ label: "Email", accessor: "email" },
	{ label: "Company", accessor: "company" },
	{ label: "Salary", accessor: "salary" },
];

const actions = [
	{
		label: "View",
		//eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		onClick: (row) => <div>Viewing {row?.name}</div>,
	},
	{
		label: "Edit",
		//eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		onClick: (row) => <div>Editing {row?.name}</div>,
	},
	{
		label: "Delete",
		//eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		onClick: (row) => <div>Deleting {row?.name}</div>,
	},
];

export function AircraftModels() {
	return (
		<div>
			<TableSort actions={actions} columns={columns} data={data} />
		</div>
	);
}
