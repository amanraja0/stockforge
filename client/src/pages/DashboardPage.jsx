import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import DashboardCharts from "../components/DashboardCharts";
import PageHeading from "../components/PageHeading";

import api from "../services/api";

import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

  const formatRevenue = (value) =>
    `₹${new Intl.NumberFormat("en-IN").format(value)}`;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get("/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-[70vh] flex items-center justify-center">
          <Spinner large />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeading>Dashboard</PageHeading>

      {stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            {[
              { label: "Total Products", value: stats.totalProducts },
              { label: "Total Orders", value: stats.totalOrders },
              { label: "Suppliers", value: stats.totalSuppliers },
              { label: "Low Stock", value: stats.lowStockProducts },
              { label: "Pending", value: stats.pendingDeliveries },
              { label: "Revenue", value: formatRevenue(stats.totalRevenue) },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 p-3 rounded-2xl hover:scale-[1.02] transition"
              >
                <p className="text-xs text-gray-400">{item.label}</p>
                <h2 className="text-xl font-bold mt-1">{item.value}</h2>
              </div>
            ))}
          </div>

          <DashboardCharts stats={stats} />
        </>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;
