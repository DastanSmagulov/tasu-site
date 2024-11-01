// components/Table.tsx
type DocumentData = {
  id: string;
  number: string;
  client: string;
  date: string;
  status: string;
};

type TableProps = {
  data: DocumentData[];
};

const Table: React.FC<TableProps> = ({ data }) => {
  return (
    <table className="min-w-full bg-white rounded-lg shadow-md">
      <thead>
        <tr>
          <th>Number</th>
          <th>Client</th>
          <th>Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50">
            <td>{item.number}</td>
            <td>{item.client}</td>
            <td>{item.date}</td>
            <td>{item.status}</td>
            <td>
              <button className="btn btn-sm btn-info">Details</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
