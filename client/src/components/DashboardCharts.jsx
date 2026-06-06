import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const DashboardCharts = ({ stats }) => {
  const activityData = [
    {
      name: "Orders",
      value: stats.totalOrders,
    },
    {
      name: "Low Stock",
      value: stats.lowStockProducts,
    },
    {
      name: "Pending",
      value: stats.pendingDeliveries,
    },
  ];

  const healthyStock = Math.max(
    stats.totalProducts - stats.lowStockProducts,
    0,
  );

  const inventoryData = [
    {
      name: "Low Stock",
      value: stats.lowStockProducts,
    },
    {
      name: "Healthy Stock",
      value: healthyStock,
    },
  ].filter((item) => item.value > 0);

  const hasInventoryData = inventoryData.length > 0;

  const COLORS = ["#ef4444", "#22c55e"];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
      <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Business Overview</h2>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-slate-700 p-4 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Inventory Status</h2>

        <div className="h-64">
          {hasInventoryData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  innerRadius={58}
                  paddingAngle={4}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {inventoryData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              No inventory data available yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
