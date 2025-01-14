import { TableSort } from "../../components/TableSort/TableSort";

const data = [
  { name: 'John Doe', email: 'john@example.com', company: 'Example Inc.' },
  { name: 'Jane Smith', email: 'jane@example.com', company: 'Example LLC' },
  // Add more data here
];

const columns = [
  { label: 'Name', accessor: 'name' },
  { label: 'Email', accessor: 'email' },
  { label: 'Company', accessor: 'company' },
];

export function AircraftModels() {
  return (
    <div>
      <TableSort data={data} columns={columns} />
    </div>
  );
}