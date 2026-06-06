const DashboardCard = ({ title, value }) => {
  return (
    <div className="bg-slate-800 p-4 rounded-2xl shadow-lg">
      <h3 className="text-sm text-slate-400">{title}</h3>

      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default DashboardCard;
