import Navbar from "../components/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="bg-[#0f172a] border-r border-white/10">
      <Navbar />

      <div className="flex-1">
        <main className="flex-1 px-4 pb-6 pt-2 md:px-6 md:pb-6 md:pt-3">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
