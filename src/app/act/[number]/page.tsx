"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { axiosInstance } from "@/helper/utils";

interface RoleOption {
  key: string;
  value: string;
}

const ActNumberPage: React.FC = () => {
  const params = useParams();
  // Get the act number from route params (e.g. /acts/[number])
  const number = params?.number as string;
  // Role will be selected from a dropdown.
  const [role, setRole] = useState<string>("");

  const [rolesOptions, setRolesOptions] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Fetch role options from /constants/roles/
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get("/constants/roles/");
        setRolesOptions(response.data);
      } catch (err: any) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
  }, []);

  // When both number and role are available, call the scan API.
  useEffect(() => {
    if (!number || !role) return;

    const scanAct = async () => {
      setLoading(true);
      setSuccess("");
      setError("");

      console.log(number, role);

      try {
        await axiosInstance.post(`/acts/scan_qr_code/${number}`, {
          role,
        });
        setSuccess("Акт успешно сканирован и статус обновлён.");
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Ошибка при сканировании акта."
        );
      } finally {
        setLoading(false);
      }
    };

    scanAct();
  }, [number, role]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Role Selection */}
      <div className="mb-4 w-full max-w-xs">
        <label
          htmlFor="role-select"
          className="block text-sm font-medium text-gray-700"
        >
          Выберите роль
        </label>
        <select
          id="role-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">-- Выберите роль --</option>
          {rolesOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.value}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="text-xl font-semibold text-gray-700">
          Сканиpование акта…
        </div>
      )}
      {success && (
        <div className="text-xl font-semibold text-green-600">{success}</div>
      )}
      {error && (
        <div className="text-xl font-semibold text-red-600">{error}</div>
      )}
    </div>
  );
};

export default ActNumberPage;
