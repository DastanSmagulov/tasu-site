import React, { useState, useEffect } from "react";
import Checkbox from "./ui/CheckBox";

interface TableColumn {
  label: string;
  key: string;
}

interface TableRow {
  [key: string]: any;
}

interface TableProps {
  columns: TableColumn[];
  initialData: TableRow[];
  title: string;
  // Add a callback to return selected service IDs
  onSelectionChange?: (selectedIds: number[]) => void;
}

const TableTotal: React.FC<TableProps> = ({
  columns,
  initialData,
  title,
  onSelectionChange,
}) => {
  const [tableData, setTableData] = useState<TableRow[]>(initialData);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const handleAddRow = () => {
    const newRow: TableRow = columns.reduce(
      (acc, column) => ({ ...acc, [column.key]: "" }),
      {}
    );
    setTableData([...tableData, newRow]);
  };

  const toggleRowSelection = (index: number) => {
    const updatedSelection = new Set(selectedRows);
    updatedSelection.has(index)
      ? updatedSelection.delete(index)
      : updatedSelection.add(index);
    setSelectedRows(updatedSelection);
  };

  const handleInputChange = (rowIndex: number, key: string, value: string) => {
    const updatedData = [...tableData];
    updatedData[rowIndex][key] = value;
    setTableData(updatedData);
  };

  // Whenever the selected rows change, map the row indices to the service IDs.
  useEffect(() => {
    if (onSelectionChange) {
      // Assuming each row has an "id" field.
      const selectedIds = Array.from(selectedRows)
        .map((rowIndex) => tableData[rowIndex]?.id)
        .filter((id) => id !== undefined);
      onSelectionChange(selectedIds);
    }
  }, [selectedRows, tableData, onSelectionChange]);

  const calculateTotal = () => {
    // For example, assuming the column key for cost is "cost"
    return tableData.reduce((total, row) => {
      const cost = parseFloat(row["cost"]) || 0;
      return total + cost;
    }, 0);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <table className="table-auto w-full border-collapse border text-gray-900 font-normal border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border border-gray-300 text-left">
              <Checkbox
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setSelectedRows(
                    new Set(isChecked ? tableData.map((_, i) => i) : [])
                  );
                }}
              />
            </th>
            {columns.map((column) => (
              <th
                key={column.key}
                className="p-2 border border-gray-300 text-left font-semibold"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="p-2 border border-gray-300">
                <Checkbox
                  checked={selectedRows.has(rowIndex)}
                  onChange={() => toggleRowSelection(rowIndex)}
                />
              </td>
              {columns.map((column) => (
                <td key={column.key} className="p-2 border border-gray-300">
                  <input
                    type="text"
                    value={row[column.key]}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                    onChange={(e) =>
                      handleInputChange(rowIndex, column.key, e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td
              colSpan={columns.length}
              className="p-2 border border-gray-300 font-bold text-right"
            >
              Итог Услуг:
            </td>
            <td className="p-2 border border-gray-300 font-bold">
              {calculateTotal()} тг.
            </td>
          </tr>
        </tfoot>
      </table>
      <button className="mt-4 py-2 px-4 rounded" onClick={handleAddRow}>
        + Добавить ещё
      </button>
    </div>
  );
};

export default TableTotal;
