"use client";
import React, { useState } from "react";
import Checkbox from "./ui/CheckBox";
import DeleteButton from "./ui/DeleteButton";
import AddMore from "./ui/AddMore";

interface TableColumn {
  label: string;
  key: string;
}

interface TableRow {
  [key: string]: any;
}

interface TableProps {
  columns: TableColumn[];
  data: TableRow[];
  onRowSelect?: (selectedRows: TableRow[]) => void;
  text: string;
  width: string;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  onRowSelect,
  text,
  width,
}) => {
  const widthTable = `w-${width}`;
  const [tableData, setTableData] = useState<TableRow[]>(data);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);

  // const toggleRowSelection = (index: number) => {
  //   const updatedSelection = new Set(selectedRows);
  //   if (updatedSelection.has(index)) {
  //     updatedSelection.delete(index);
  //   } else {
  //     updatedSelection.add(index);
  //   }
  //   setSelectedRows(updatedSelection);
  //   if (onRowSelect) {
  //     onRowSelect([...updatedSelection].map((i) => tableData[i]));
  //   }
  // };

  const handleAddRow = () => {
    const newRow: TableRow = columns.reduce(
      (acc, column) => ({ ...acc, [column.key]: "" }),
      {}
    );
    setTableData((prevData) => [...prevData, newRow]);
    setEditingRowIndex(tableData.length); // Set the last row to be editable
  };

  const handleDeleteRows = () => {
    const remainingData = tableData.filter(
      (_, index) => !selectedRows.has(index)
    );
    setTableData(remainingData);
    setSelectedRows(new Set());
  };

  const handleInputChange = (rowIndex: number, key: string, value: string) => {
    const updatedData = [...tableData];
    updatedData[rowIndex][key] = value;
    setTableData(updatedData);
  };

  return (
    <div>
      {text && <h2 className="text-lg font-semibold mb-4">{text}</h2>}
      <table
        className={`table-auto ${widthTable} text-gray-900 border-collapse border border-gray-300`}
      >
        <thead>
          <tr className="bg-white">
            <th className="p-2 border border-gray-300 text-left">
              <Checkbox
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  const allIndexes = tableData.map((_, index) => index);
                  setSelectedRows(new Set(isChecked ? allIndexes : []));
                  if (onRowSelect) {
                    onRowSelect(isChecked ? tableData : []);
                  }
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
            <tr key={rowIndex} className="bg-white">
              <td className="p-2 border border-gray-300">
                <Checkbox />
              </td>
              {columns.map((column) => (
                <td key={column.key} className="p-2 border border-gray-300">
                  {editingRowIndex === rowIndex ? (
                    <input
                      type="text"
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                      value={row[column.key]}
                      onChange={(e) =>
                        handleInputChange(rowIndex, column.key, e.target.value)
                      }
                    />
                  ) : (
                    row[column.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-4 mt-4">
        <DeleteButton onClick={handleDeleteRows} />
        <AddMore onClick={handleAddRow} />
      </div>
    </div>
  );
};

export default Table;
