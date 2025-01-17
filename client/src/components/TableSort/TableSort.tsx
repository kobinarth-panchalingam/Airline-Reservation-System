import {
	ActionIcon,
	Button,
	Center,
	Group,
	Modal,
	ScrollArea,
	Table,
	Text,
	TextInput,
	UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
	IconChevronDown,
	IconChevronUp,
	IconEdit,
	IconEye,
	IconSearch,
	IconSelector,
	IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import classes from "./TableSort.module.css";
import { TableAction } from "../../types/enums";

export type RowData = Record<string, string | number | null>;

interface Column<T> {
	label: string;
	accessor: keyof T;
}

interface ActionConfig<T> {
	tableAction: TableAction;
	label: string;
	onClick: (row: T) => React.ReactNode | void;
}

interface TableSortProps<T> {
	data: Array<T>;
	columns: Array<Column<T>>;
	actions: Array<ActionConfig<T>>;
}

interface ThProps {
	children: React.ReactNode;
	reversed: boolean;
	sorted: boolean;
	onSort: () => void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
	const Icon = sorted
		? reversed
			? IconChevronUp
			: IconChevronDown
		: IconSelector;
	return (
		<Table.Th className={classes.th}>
			<UnstyledButton className={classes.control} onClick={onSort}>
				<Group justify="space-between">
					<Text fw={500} fz="sm">
						{children}
					</Text>
					<Center className={classes.icon}>
						<Icon size={16} stroke={1.5} />
					</Center>
				</Group>
			</UnstyledButton>
		</Table.Th>
	);
}

function filterData<T>(data: Array<T>, search: string) {
	const query = search.toLowerCase().trim();
	return data.filter((item) =>
		Object.keys(item as object).some((key) =>
			String(item[key as keyof T])
				.toLowerCase()
				.includes(query)
		)
	);
}

function sortData<T>(
	data: Array<T>,
	payload: { sortBy: keyof T | null; reversed: boolean; search: string }
) {
	const { sortBy } = payload;

	if (!sortBy) {
		return filterData(data, payload.search);
	}

	return filterData(
		[...data].sort((a, b) => {
			if (a[sortBy] === null || a[sortBy] === undefined) return 1;
			if (b[sortBy] === null || b[sortBy] === undefined) return -1;
			if (a[sortBy] === b[sortBy]) return 0;

			if (typeof a[sortBy] === "number" && typeof b[sortBy] === "number") {
				return payload.reversed ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy];
			}

			if (typeof a[sortBy] === "string" && typeof b[sortBy] === "string") {
				return payload.reversed
					? b[sortBy].localeCompare(a[sortBy])
					: a[sortBy].localeCompare(b[sortBy]);
			}

			return 0;
		}),
		payload.search
	);
}

export function TableSort<T extends RowData>({
	data,
	columns,
	actions,
}: TableSortProps<T>) {
	const [search, setSearch] = useState("");
	const [sortedData, setSortedData] = useState(data || []);
	const [sortBy, setSortBy] = useState<keyof T | null>(null);
	const [reverseSortDirection, setReverseSortDirection] = useState(false);
	const [opened, { open, close }] = useDisclosure(false);
	const [modalContent, setModalContent] = useState<React.ReactNode>(null);
	const [actionTitle, setActionTitle] = useState<string>("");

	useEffect(() => {
		setSortedData(data || []);
	}, [data]);

	const handleOnSort = (field: keyof T) => {
		const reversed = field === sortBy ? !reverseSortDirection : false;
		setReverseSortDirection(reversed);
		setSortBy(field);
		setSortedData(sortData(data, { sortBy: field, reversed, search }));
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.currentTarget;
		setSearch(value);
		setSortedData(
			sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
		);
	};

	const handleActionClick = (action: ActionConfig<T>, row: T) => {
		if (action.tableAction === TableAction.delete) {
			action.onClick(row);
			return;
		}
		setActionTitle(action.label);
		setModalContent(action.onClick(row) || null);
		open();
	};

	const handleInsertClick = () => {
		const action = actions?.find((a) => a.tableAction === TableAction.insert);
		if (action) {
			setActionTitle(action.label);
			setModalContent(action.onClick({} as T) || null);
			open();
		}
	};

	const rows = sortedData.map((row, index) => (
		<Table.Tr key={index}>
			{columns.map((column) => (
				<Table.Td key={column.accessor as string}>
					{row[column.accessor]}
				</Table.Td>
			))}
			{actions && (
				<Table.Td>
					<Group>
						{actions.map(
							(action) =>
								action.tableAction !== TableAction.insert && (
									<ActionIcon
										key={action.label}
										onClick={() => {
											handleActionClick(action, row);
										}}
									>
										{action.tableAction === TableAction.view && (
											<IconEye size={16} />
										)}
										{action.tableAction === TableAction.edit && (
											<IconEdit size={16} />
										)}
										{action.tableAction === TableAction.delete && (
											<IconTrash size={16} />
										)}
									</ActionIcon>
								)
						)}
					</Group>
				</Table.Td>
			)}
		</Table.Tr>
	));

	return (
		<>
			<Modal centered opened={opened} title={actionTitle} onClose={close}>
				{modalContent}
			</Modal>
			<ScrollArea>
				<div className={classes.searchBar}>
					<div className={classes.textInput}>
						<TextInput
							leftSection={<IconSearch size={16} stroke={1.5} />}
							mb="md"
							placeholder="Search by any field"
							value={search}
							onChange={handleSearchChange}
						/>
					</div>
					<Button onClick={handleInsertClick}>Insert</Button>
				</div>
				<Table
					horizontalSpacing="md"
					layout="fixed"
					miw={700}
					verticalSpacing="xs"
				>
					<Table.Tbody>
						<Table.Tr>
							{columns.map((column) => (
								<Th
									key={column.accessor as string}
									reversed={reverseSortDirection}
									sorted={sortBy === column.accessor}
									onSort={() => {
										handleOnSort(column.accessor);
									}}
								>
									{column.label}
								</Th>
							))}
							{actions && (
								<Th reversed={false} sorted={false} onSort={() => {}}>
									Actions
								</Th>
							)}
						</Table.Tr>
					</Table.Tbody>
					<Table.Tbody>
						{rows.length > 0 ? (
							rows
						) : (
							<Table.Tr>
								<Table.Td colSpan={columns.length + (actions ? 1 : 0)}>
									<Text fw={500} ta="center">
										Nothing found
									</Text>
								</Table.Td>
							</Table.Tr>
						)}
					</Table.Tbody>
				</Table>
			</ScrollArea>
		</>
	);
}
