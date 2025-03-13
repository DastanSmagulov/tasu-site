"use client";
import React, { useState, useEffect } from "react";
import CheckBox from "@/components/ui/CheckBox";
import Cookies from "js-cookie";
import { axiosInstance } from "@/helper/utils";

// Interfaces
interface AccountDetails {
  id?: number;
  bin: string;
  bik: string;
  address: string;
  number_check: string;
  kbe: string;
  director: string;
  contacts: string;
  currency: string;
  name_bank: string;
}

interface ExpenseData {
  id: number;
  // We store only the ID for customer/partner:
  customer: number;
  customer_sum: number;
  customer_account_details: AccountDetails;
  partner: number;
  partner_sum: number;
  partner_account_details: AccountDetails;
  created_at: string;
}

export interface ExpenseAct {
  id: number;
  number?: string;
  expense_is_confirmed: boolean;
  expense_is_paid: boolean;
  expense_data: ExpenseData;
}

interface TableProps {
  data: ExpenseAct;
  setData: React.Dispatch<React.SetStateAction<ExpenseAct>>;
}

// Fallback for missing expense_data.
const defaultExpenseData: ExpenseData = {
  id: 0,
  customer: 0,
  customer_sum: 0,
  customer_account_details: {
    bin: "",
    bik: "",
    address: "",
    number_check: "",
    kbe: "",
    director: "",
    contacts: "",
    currency: "",
    name_bank: "",
  },
  partner: 0,
  partner_sum: 0,
  partner_account_details: {
    bin: "",
    bik: "",
    address: "",
    number_check: "",
    kbe: "",
    director: "",
    contacts: "",
    currency: "",
    name_bank: "",
  },
  created_at: "",
};

// Editor component for AccountDetails.
const AccountDetailsEditor: React.FC<{
  details: AccountDetails;
  onChange: (updated: AccountDetails) => void;
}> = ({ details, onChange }) => (
  <div className="space-y-2">
    {[
      { label: "БИН", key: "bin" },
      { label: "БИК", key: "bik" },
      { label: "Адрес", key: "address" },
      { label: "Номер счета", key: "number_check" },
      { label: "КБЕ", key: "kbe" },
      { label: "Директор", key: "director" },
      { label: "Контакты", key: "contacts" },
      { label: "Валюта", key: "currency" },
      { label: "Название банка", key: "name_bank" },
    ].map((field) => (
      <div key={field.key}>
        <label className="block text-sm font-medium">{field.label}:</label>
        <input
          type="text"
          value={(details as any)[field.key] || ""}
          onChange={(e) =>
            onChange({ ...details, [field.key]: e.target.value })
          }
          className="w-full p-1 border rounded"
        />
      </div>
    ))}
  </div>
);

// A simpler one-line “view” of AccountDetails, or expand as needed.
function formatAccountDetails(details: AccountDetails) {
  return (
    `Адрес: ${details.address}, ` +
    `БИН: ${details.bin}, ` +
    `БИК: ${details.bik}, ` +
    `ИИК: ${details.number_check}, ` +
    `Банк: ${details.name_bank}`
  );
}

const ExpenseActTable: React.FC<TableProps> = ({ data, setData }) => {
  // Local state for editing the act.
  const [localData, setLocalData] = useState<ExpenseAct>(data);

  // Separate editing flags for customer/partner rows
  const [editingCustomer, setEditingCustomer] = useState(false);
  const [editingPartner, setEditingPartner] = useState(false);

  // Options for select inputs
  const [partnerOptions, setPartnerOptions] = useState<any[]>([]);
  const [customerOptions, setCustomerOptions] = useState<any[]>([]);

  // Fetch partner options
  useEffect(() => {
    axiosInstance
      .get("/admin/partners/")
      .then((res) => {
        setPartnerOptions(res.data.results);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch customer options
  useEffect(() => {
    axiosInstance
      .get("/admin/users/")
      .then((res) => {
        setCustomerOptions(res.data.results);
      })
      .catch((err) => console.error(err));
  }, []);

  // Sync localData when parent's data changes.
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Helper to update nested expense_data fields.
  const updateExpenseDataField = <K extends keyof ExpenseData>(
    field: K,
    value: ExpenseData[K]
  ) => {
    const updatedExpenseData = { ...localData.expense_data, [field]: value };
    const updated = { ...localData, expense_data: updatedExpenseData };
    setLocalData(updated);
    setData(updated);
  };

  // Helper for top-level fields.
  const updateField = <K extends keyof ExpenseAct>(
    field: K,
    value: ExpenseAct[K]
  ) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    setData(updated);
  };

  // Format date
  const createdDate = new Date(
    localData.expense_data.created_at
  ).toLocaleDateString();

  // Helper to find the display name for the selected ID
  // Adjust `full_name`, `name`, etc. to your actual fields.
  function getCustomerNameById(id: number) {
    const found = customerOptions.find((option) => option.id === id);
    return found ? found.full_name : `ID #${id}`;
  }

  function getPartnerNameById(id: number) {
    const found = partnerOptions.find((option) => option.id === id);
    return found ? found.name : `ID #${id}`;
  }

  return (
    <div className="space-y-6">
      <table className="min-w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Тип расхода</th>
            <th className="border p-2">Наименование</th>
            <th className="border p-2">Контакты</th>
            <th className="border p-2">Реквизиты</th>
            <th className="border p-2">Дата</th>
            <th className="border p-2">Сумма</th>
            <th className="border p-2">Действие</th>
          </tr>
        </thead>
        <tbody>
          {/* Row for the CUSTOMER */}
          <tr className={editingCustomer ? "bg-yellow-50" : ""}>
            <td className="border p-2">Заказчик</td>

            {/* Наименование (customer) with a select */}
            <td className="border p-2">
              {editingCustomer ? (
                <select
                  value={
                    localData.expense_data.customer
                      ? String(localData.expense_data.customer)
                      : ""
                  }
                  onChange={(e) => {
                    const selectedId = Number(e.target.value);
                    updateExpenseDataField("customer", selectedId);
                  }}
                  className="w-full p-1 border rounded"
                >
                  <option value="">Выберите заказчика</option>
                  {customerOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.full_name ?? `Заказчик #${option.id}`}
                    </option>
                  ))}
                </select>
              ) : (
                // Display the found name or fallback to "ID #..."
                getCustomerNameById(localData.expense_data.customer)
              )}
            </td>

            {/* Контакты (customer_account_details.contacts) */}
            <td className="border p-2">
              {editingCustomer ? (
                <input
                  type="text"
                  value={
                    localData.expense_data.customer_account_details.contacts ||
                    ""
                  }
                  onChange={(e) => {
                    const updatedDetails = {
                      ...localData.expense_data.customer_account_details,
                      contacts: e.target.value,
                    };
                    updateExpenseDataField(
                      "customer_account_details",
                      updatedDetails
                    );
                  }}
                  className="w-full p-1 border rounded"
                />
              ) : (
                localData.expense_data.customer_account_details.contacts
              )}
            </td>

            {/* Реквизиты (customer_account_details) */}
            <td className="border p-2">
              {editingCustomer ? (
                <AccountDetailsEditor
                  details={localData.expense_data.customer_account_details}
                  onChange={(updatedDetails) =>
                    updateExpenseDataField(
                      "customer_account_details",
                      updatedDetails
                    )
                  }
                />
              ) : (
                formatAccountDetails(
                  localData.expense_data.customer_account_details
                )
              )}
            </td>

            {/* Дата */}
            <td className="border p-2">{createdDate}</td>

            {/* Сумма (customer_sum) */}
            <td className="border p-2">
              {editingCustomer ? (
                <input
                  type="number"
                  value={localData.expense_data.customer_sum}
                  onChange={(e) =>
                    updateExpenseDataField(
                      "customer_sum",
                      Number(e.target.value)
                    )
                  }
                  className="w-full p-1 border rounded"
                />
              ) : (
                localData.expense_data.customer_sum
              )}
            </td>

            {/* Действие */}
            <td className="border p-2">
              {editingCustomer ? (
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                    onClick={() => setEditingCustomer(false)}
                  >
                    Сохранить
                  </button>
                  <button
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                    onClick={() => {
                      // Revert changes to parent's data
                      setLocalData(data);
                      setEditingCustomer(false);
                    }}
                  >
                    Отменить
                  </button>
                </div>
              ) : (
                <button
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                  onClick={() => setEditingCustomer(true)}
                >
                  Редактировать
                </button>
              )}
            </td>
          </tr>

          {/* Row for the PARTNER */}
          <tr className={editingPartner ? "bg-yellow-50" : ""}>
            <td className="border p-2">Партнёр</td>

            {/* Наименование (partner) with a select */}
            <td className="border p-2">
              {editingPartner ? (
                <select
                  value={
                    localData.expense_data.partner
                      ? String(localData.expense_data.partner)
                      : ""
                  }
                  onChange={(e) => {
                    const selectedId = Number(e.target.value);
                    updateExpenseDataField("partner", selectedId);
                  }}
                  className="w-full p-1 border rounded"
                >
                  <option value="">Выберите партнёра</option>
                  {partnerOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name ?? `Партнёр #${option.id}`}
                    </option>
                  ))}
                </select>
              ) : (
                // Display the found name or fallback to "ID #..."
                getPartnerNameById(localData.expense_data.partner)
              )}
            </td>

            {/* Контакты (partner_account_details.contacts) */}
            <td className="border p-2">
              {editingPartner ? (
                <input
                  type="text"
                  value={
                    localData.expense_data.partner_account_details.contacts ||
                    ""
                  }
                  onChange={(e) => {
                    const updatedDetails = {
                      ...localData.expense_data.partner_account_details,
                      contacts: e.target.value,
                    };
                    updateExpenseDataField(
                      "partner_account_details",
                      updatedDetails
                    );
                  }}
                  className="w-full p-1 border rounded"
                />
              ) : (
                localData.expense_data.partner_account_details.contacts
              )}
            </td>

            {/* Реквизиты (partner_account_details) */}
            <td className="border p-2">
              {editingPartner ? (
                <AccountDetailsEditor
                  details={localData.expense_data.partner_account_details}
                  onChange={(updatedDetails) =>
                    updateExpenseDataField(
                      "partner_account_details",
                      updatedDetails
                    )
                  }
                />
              ) : (
                formatAccountDetails(
                  localData.expense_data.partner_account_details
                )
              )}
            </td>

            {/* Дата */}
            <td className="border p-2">{createdDate}</td>

            {/* Сумма (partner_sum) */}
            <td className="border p-2">
              {editingPartner ? (
                <input
                  type="number"
                  value={localData.expense_data.partner_sum}
                  onChange={(e) =>
                    updateExpenseDataField(
                      "partner_sum",
                      Number(e.target.value)
                    )
                  }
                  className="w-full p-1 border rounded"
                />
              ) : (
                localData.expense_data.partner_sum
              )}
            </td>

            {/* Действие */}
            <td className="border p-2">
              {editingPartner ? (
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                    onClick={() => setEditingPartner(false)}
                  >
                    Сохранить
                  </button>
                  <button
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                    onClick={() => {
                      // Revert changes to parent's data
                      setLocalData(data);
                      setEditingPartner(false);
                    }}
                  >
                    Отменить
                  </button>
                </div>
              ) : (
                <button
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                  onClick={() => setEditingPartner(true)}
                >
                  Редактировать
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Optional toggles below the table */}
      <div className="mt-4 space-y-2">
        <div>
          <label className="flex gap-3 text-md font-medium">
            Оплачены:{" "}
            <CheckBox
              checked={localData.expense_is_paid}
              onChange={(e) => updateField("expense_is_paid", e.target.checked)}
            />
          </label>
        </div>
        <div>
          <label className="flex gap-3 text-md font-medium">
            Рассходы подтверждены:{" "}
            <CheckBox
              checked={localData.expense_is_confirmed}
              onChange={(e) =>
                updateField("expense_is_confirmed", e.target.checked)
              }
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ExpenseActTable;
