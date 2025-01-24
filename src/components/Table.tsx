"use client";
import React, { useState, useEffect } from "react";
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
  onAddRow?: (newRow: TableRow) => void;
  onDeleteRows?: (selectedRows: Set<number>) => void;
  onEditRow?: (id: number, updatedData: Partial<TableRow>) => void; // New prop
  text: string;
  width: string;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  onRowSelect,
  onAddRow,
  onDeleteRows,
  onEditRow,
  text,
  width,
}) => {
  const widthTable = `w-${width}`;
  const [tableData, setTableData] = useState<TableRow[]>(data);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleAddRow = () => {
    const newRow: TableRow = columns.reduce(
      (acc, column) => ({ ...acc, [column.key]: "" }),
      {}
    );
    setTableData((prevData) => [...prevData, newRow]);
    setEditingRowIndex(tableData.length);
    setErrorMessage(null);
  };

  const handleDeleteRows = () => {
    if (onDeleteRows) {
      onDeleteRows(selectedRows);
    }
    setSelectedRows(new Set());
  };

  const handleInputChange = (rowIndex: number, key: string, value: string) => {
    const updatedData = [...tableData];
    updatedData[rowIndex][key] = value;
    setTableData(updatedData);
  };

  const handleSaveRow = (rowIndex: number) => {
    const row = tableData[rowIndex];
    const isRowValid = columns.every((column) => row[column.key].trim() !== "");

    if (!isRowValid) {
      setErrorMessage("Пожалуйста заполните все поля перед сохранением.");
      return;
    }

    setEditingRowIndex(null);
    setErrorMessage(null);

    // Trigger onEditRow if editing an existing row
    if (onEditRow && row.id !== undefined) {
      onEditRow(row.id, row);
    }
  };

  const isAddButtonDisabled = tableData.some((row, index) =>
    columns.some(
      (column) => row[column.key].trim() === "" && index === editingRowIndex
    )
  );

  return (
    <div>
      {text && <h2 className="text-lg font-semibold mb-4">{text}</h2>}
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
      <table
        className={`table-auto ${widthTable} text-gray-900 border-collapse border border-gray-300`}
      >
        <thead>
          <tr className="bg-white">
            <th className="p-2 border border-gray-300 text-left">
              <Checkbox
                checked={isAllSelected}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setIsAllSelected(isChecked);
                  if (isChecked) {
                    const allIndexes = tableData.map((_, index) => index);
                    setSelectedRows(new Set(allIndexes));
                    if (onRowSelect) {
                      onRowSelect(tableData);
                    }
                  } else {
                    setSelectedRows(new Set());
                    if (onRowSelect) {
                      onRowSelect([]);
                    }
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
                <Checkbox
                  checked={selectedRows.has(rowIndex)}
                  onChange={(e) => {
                    const newSelectedRows = new Set(selectedRows);
                    if (e.target.checked) {
                      newSelectedRows.add(rowIndex);
                    } else {
                      newSelectedRows.delete(rowIndex);
                    }
                    setSelectedRows(newSelectedRows);
                    if (onRowSelect) {
                      onRowSelect(
                        tableData.filter((_, index) =>
                          newSelectedRows.has(index)
                        )
                      );
                    }
                  }}
                />
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
                      onBlur={() => handleSaveRow(rowIndex)}
                    />
                  ) : (
                    row[column.key]
                  )}
                </td>
              ))}
              <td className="p-2 border border-gray-300 text-center">
                <button
                  className="text-blue-500 hover:underline bg-transparent hover:bg-transparent"
                  onClick={() => setEditingRowIndex(rowIndex)}
                >
                  ✏️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-4 mt-4">
        <DeleteButton onClick={handleDeleteRows} />
        <AddMore onClick={handleAddRow} disabled={isAddButtonDisabled} />
      </div>
    </div>
  );
};

export default Table;
