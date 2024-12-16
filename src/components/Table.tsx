import Link from "next/link";
import React, { useState } from "react";
import { jsPDF } from "jspdf";
import JSZip from "jszip"; // Import JSZip

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
}

const Table: React.FC<TableProps> = ({ data }) => {
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

  return (
    <div className="p-4">
      {/* <div className="flex gap-4 mb-4">
        <button onClick={handleDownloadZip} className="btn btn-sm btn-primary">
          Download ZIP
        </button>
        <button
          onClick={handleSendWhatsApp}
          className="btn btn-sm btn-secondary"
        >
          Send to WhatsApp
        </button>
        <button
          onClick={handlePrintDocuments}
          className="btn btn-sm btn-accent"
        >
          Print
        </button>
      </div> */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full rounded-lg shadow-md table-no-side-borders">
          <thead>
            <tr className="bg-white text-gray-700 font-semibold text-sm">
              <th className="p-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  onChange={toggleSelectAll}
                  checked={selectedRows.size === data.length}
                />
              </th>
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
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedRows.has(row.id)}
                    onChange={() => toggleSelection(row.id)}
                  />
                </td>
                <td className="p-3 border border-gray-300">
                  <Link href={`/act/${row.id.slice(1)}`}>{row.id}</Link>
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
                  <button className="text-gray-400 hover:text-gray-600 bg:text-[#F2F2F2]">
                    •••
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
