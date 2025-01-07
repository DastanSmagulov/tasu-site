import Link from "next/link";
import React, { useState } from "react";
import { jsPDF } from "jspdf";
import JSZip from "jszip";
import TrashIcon from "../../public/icons/trash.svg";
import Checkbox from "@/components/ui/CheckBox";
import Image from "next/image";

interface TableRow {
  id: string;
  customer: string;
  date: string;
  place: string;
  weight: string;
  volume: string;
  status: string;
  statusColor: string;
  view: string;
  amount: string;
}

interface TableProps {
  data: TableRow[];
  role: string;
}

const Table: React.FC<TableProps> = ({ data, role }) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Toggle selection for a specific row
  const toggleSelection = (id: string) => {
    setSelectedRows((prevSelected) => {
      const updatedSelected = new Set(prevSelected);
      if (updatedSelected.has(id)) {
        updatedSelected.delete(id);
      } else {
        updatedSelected.add(id);
      }
      return updatedSelected;
    });
  };

  // Handle selecting all rows
  const toggleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set()); // Deselect all
    } else {
      setSelectedRows(new Set(data.map((row) => row.id))); // Select all
    }
  };

  // Create and add a PDF to the ZIP archive
  const generatePDF = (row: TableRow, zip: JSZip) => {
    const doc = new jsPDF();
    doc.text(`Order ID: ${row.id}`, 10, 10);
    doc.text(`Customer: ${row.customer}`, 10, 20);
    doc.text(`Date: ${row.date}`, 10, 30);
    doc.text(`Place: ${row.place}`, 10, 40);
    doc.text(`Weight: ${row.weight}`, 10, 50);
    doc.text(`Volume: ${row.volume}`, 10, 60);
    doc.text(`Status: ${row.status}`, 10, 70);
    doc.text(`Amount: ${row.amount}`, 10, 80);

    const pdfBlob = doc.output("blob");
    zip.file(`${row.id}.pdf`, pdfBlob); // Add the PDF to the ZIP archive
  };

  // Handle downloading ZIP
  const handleDownloadZip = () => {
    const zip = new JSZip();

    // Generate PDF for each selected row and add it to the ZIP
    selectedRows.forEach((id) => {
      const row = data.find((row) => row.id === id);
      if (row) {
        generatePDF(row, zip);
      }
    });

    // Generate the ZIP and trigger download
    zip.generateAsync({ type: "blob" }).then((content) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "documents.zip"; // Default name for the ZIP file
      link.click();
    });
  };

  // Handle sending the document via WhatsApp
  const handleSendWhatsApp = () => {
    selectedRows.forEach((id) => {
      const row = data.find((row) => row.id === id);
      if (row) {
        const message = `Sending document for order ${id} to ${row.customer}`;
        const phone = "87029134650"; // Placeholder number for demo
        const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(
          message
        )}`;
        window.open(whatsappURL, "_blank");
      }
    });
  };

  const handlePrintDocuments = () => {
    // Loop through all selected rows
    selectedRows.forEach((id) => {
      const row = data.find((row) => row.id === id);
      if (row) {
        const doc = new jsPDF();
        doc.text(`Order ID: ${row.id}`, 10, 10);
        doc.text(`Customer: ${row.customer}`, 10, 20);
        doc.text(`Date: ${row.date}`, 10, 30);
        doc.text(`Place: ${row.place}`, 10, 40);
        doc.text(`Weight: ${row.weight}`, 10, 50);
        doc.text(`Volume: ${row.volume}`, 10, 60);
        doc.text(`Status: ${row.status}`, 10, 70);
        doc.text(`Amount: ${row.amount}`, 10, 80);

        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);

        const printWindow = window.open(pdfUrl, "_blank");
        if (printWindow) {
          printWindow.print();
        }
      }
    });
  };

  // Handle deleting selected rows
  const handleDeleteSelected = () => {
    const updatedData = data.filter((row) => !selectedRows.has(row.id));
    setSelectedRows(new Set()); // Clear selected rows
    // Update the data state (assuming data is managed in a parent component)
    // You can pass a callback to update the parent component's state
    console.log("Updated Data:", updatedData);
  };

  return (
    <div className="mt-8">
      <div className="overflow-x-auto">
        <table className="table-auto w-full rounded-lg shadow-md table-no-side-borders">
          <thead>
            <tr className="bg-white text-gray-700 font-semibold text-sm">
              <th className="p-3 pl-10">
                <Checkbox
                  id="select-all"
                  defaultChecked={selectedRows.size === data.length}
                  onChange={toggleSelectAll}
                />
              </th>
              {/* <th className="p-3 pl-10">
                <Checkbox id="number" />
              </th> */}
              <th className="p-3 text-left">Номер</th>
              <th className="p-3 text-left">Заказчик</th>
              <th className="p-3 text-left">Дата</th>
              <th className="p-3 text-left">Мест</th>
              <th className="p-3 text-left">Вес</th>
              <th className="p-3 text-left">Куб</th>
              <th className="p-3 text-left">Статус</th>
              <th className="p-3 text-left">Вид</th>
              <th className="p-3 text-left">Сумма</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data?.map((row) => (
              <tr key={row.id} className="text-sm text-gray-800">
                <td className="p-3 pl-10 border border-gray-300">
                  <Checkbox
                    id={`checkbox-${row.id}`}
                    defaultChecked={selectedRows.has(row.id)}
                    onChange={() => toggleSelection(row.id)}
                  />
                </td>
                <td className="p-3 border border-gray-300">
                  <Link href={`${role}/act/${row.id.slice(1)}`}>{row.id}</Link>
                </td>
                <td className="p-3 border border-gray-300">{row.customer}</td>
                <td className="p-3 border border-gray-300">{row.date}</td>
                <td className="p-3 border border-gray-300">{row.place}</td>
                <td className="p-3 font-semibold border border-gray-300">
                  {row.weight}
                </td>
                <td className="p-3 border border-gray-300">{row.volume}</td>
                <td className="p-3 border border-gray-300">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${row.statusColor}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="p-3 text-center border border-gray-300">
                  {row.view || "-"}
                </td>
                <td className="p-3 text-center border border-gray-300">
                  {row.amount || "-"}
                </td>
                <td className="p-3 text-center border border-gray-300">
                  <button className="text-gray-400 bg-transparent hover:bg-transparent hover:text-gray-600 bg:text-[#F2F2F2]">
                    •••
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-4 mt-4">
        {selectedRows.size > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="btn text-white font-bold btn-sm bg-[#EE4040] hover:bg-[#f54d4d] border-none"
          >
            <Image
              src={TrashIcon}
              width={4}
              height={4}
              className="mr-1"
              alt="trash"
            />{" "}
            Удалить
          </button>
        )}
      </div>
    </div>
  );
};

export default Table;
