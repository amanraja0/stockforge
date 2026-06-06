import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import PageHeading from "../components/PageHeading";

import api from "../services/api";

import toast from "react-hot-toast";

const InventoryLogsPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/inventory/logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLogs(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch logs");
    }
  };

  return (
    <DashboardLayout>
      <PageHeading>Inventory Logs</PageHeading>

      <div className="bg-slate-800 rounded-2xl overflow-x-auto border border-slate-700">
        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              <th className="p-4 text-left">Product</th>

              <th className="p-4 text-left">Action</th>

              <th className="p-4 text-left">Changed</th>

              <th className="p-4 text-left">Previous</th>

              <th className="p-4 text-left">New</th>

              <th className="p-4 text-left">Note</th>

              <th className="p-4 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-t border-slate-700 hover:bg-slate-700/40 transition"
              >
                <td className="p-4">{log.Product?.name}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      log.action === "ADD" ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {log.action}
                  </span>
                </td>

                <td className="p-4">{log.quantityChanged}</td>

                <td className="p-4">{log.previousQuantity}</td>

                <td className="p-4">{log.newQuantity}</td>

                <td className="p-4">{log.note}</td>

                <td className="p-4">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default InventoryLogsPage;
