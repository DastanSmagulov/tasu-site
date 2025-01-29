"use client";
import React, { useState, useEffect } from "react";
import Checkbox from "./ui/CheckBox";
import DeleteButton from "./ui/DeleteButton";
import AddMore from "./ui/AddMore";

interface TableColumn {
  label: string;
  key: string;
  type?: "text" | "dropdown"; // Add type to specify input type
  options?: { value: string; label: string }[]; // Options for dropdown
}

interface TableRow {
  [key: string]: any;
}

interface TableProps {
  columns: TableColumn[];
  data: TableRow[];
  onRowSelect?: (selectedRows: TableRow[]) => void;
  onAddRow?: any;
  onDeleteRows?: (selectedRows: Set<number>) => void;
  onEditRow?: (id: number, updatedData: Partial<TableRow>) => void;
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

  // Sync table data with external data
  useEffect(() => {
    setTableData(data);
  }, [data]);

  // Add a new row
  const handleAddRow = () => {
    const newRow: TableRow = columns.reduce(
      (acc, column) => ({ ...acc, [column.key]: "" }),
      {}
    );
    setTableData((prevData) => [...prevData, newRow]);
    setEditingRowIndex(tableData.length); // Set the new row as editable
    setErrorMessage(null);
  };

  // Delete selected rows
  const handleDeleteRows = () => {
    if (onDeleteRows) {
      onDeleteRows(selectedRows);
    }
    setSelectedRows(new Set());
  };

  // Handle input changes in editable fields
  const handleInputChange = (rowIndex: number, key: string, value: string) => {
    const updatedData = [...tableData];
    updatedData[rowIndex][key] = value;
    setTableData(updatedData);
  };

  // Transform car data to the correct format
  const transformCar = (data: TableRow) => {
    return {
      license_plate: data.type,
      brand: data.info1,
      color: data.info2,
      model: data.info3,
    };
  };

  // Transform train data to the correct format
  const transformTrain = (data: TableRow) => {
    return {
      train_number: data.type,
      train_route: data.info1,
      railway_company: data.info2,
    };
  };

  const handleSaveRow = (rowIndex: number) => {
    const row = tableData[rowIndex];
    const isRowValid = columns.every((column) => row[column.key].trim() !== "");

    if (!isRowValid) {
      setErrorMessage("Пожалуйста заполните все поля перед сохранением.");
      return;
    }

    // Transform the row data based on the table type
    let transformedData: TableRow = row;
    if (text === "Машина") {
      transformedData = transformCar(row);
    } else if (text === "Поезд") {
      transformedData = transformTrain(row);
    }

    if (row.id !== undefined) {
      // Сохранение существующей строки
      if (onEditRow) {
        console.log("Editing row:", transformedData); // Для отладки
        onEditRow(row.id, transformedData);
      }
    } else {
      // Добавление новой строки
      if (onAddRow) {
        console.log("Adding row:", transformedData); // Для отладки
        onAddRow(transformedData);
      }
    }

    setTableData((prevData) => {
      const updatedData = [...prevData];
      updatedData[rowIndex] = row;
      return updatedData;
    });

    setEditingRowIndex(null);
    setErrorMessage(null);
  };

  // Check if the "Add More" button should be disabled
  const isAddButtonDisabled = editingRowIndex !== null;

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
            <th className="p-2 border border-gray-300 text-left font-semibold">
              Изменить
            </th>
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
                    column.type === "dropdown" ? (
                      <select
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                        value={row[column.key]}
                        onChange={(e) =>
                          handleInputChange(
                            rowIndex,
                            column.key,
                            e.target.value
                          )
                        }
                      >
                        <option value="">Выберите...</option>
                        {column.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                        value={row[column.key]}
                        onChange={(e) =>
                          handleInputChange(
                            rowIndex,
                            column.key,
                            e.target.value
                          )
                        }
                      />
                    )
                  ) : column.type === "dropdown" ? (
                    column.options?.find(
                      (option) => option.value === row[column.key]
                    )?.label || row[column.key]
                  ) : (
                    row[column.key]
                  )}
                </td>
              ))}
              <td className="p-2 border border-gray-300 text-center">
                {editingRowIndex === rowIndex ? (
                  <button
                    className="text-green-500 hover:underline bg-transparent hover:bg-transparent"
                    onClick={() => handleSaveRow(rowIndex)}
                  >
                    💾
                  </button>
                ) : (
                  <button
                    className="hover:bg-slate-400 bg-transparent hover:bg-transparent"
                    onClick={() => setEditingRowIndex(rowIndex)}
                  >
                    ✏️
                  </button>
                )}
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
