import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Products",
      path: "/products",
    },
    {
      name: "Orders",
      path: "/orders",
    },
    {
      name: "Inventory Logs",
      path: "/inventory-logs",
    },
  ];

  if (user?.role === "ADMIN") {
    navLinks.push({
      name: "Users",
      path: "/users",
    });
  }

  return (
    <div className="w-full bg-slate-900 px-4 py-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">StockForge</h1>

        <div className="flex items-center gap-3 lg:hidden">
          <span className="text-sm text-slate-300">Welcome, {user?.name}</span>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 transition px-3 py-1.5 rounded-lg text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`block px-3 py-2 rounded-lg text-sm transition ${
              location.pathname === link.path
                ? "bg-blue-600"
                : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            {link.name}
          </Link>
        ))}

        <div className="hidden lg:flex items-center gap-3 ml-2 pl-4 border-l border-white/10">
          <span className="text-sm text-slate-300">Welcome, {user?.name}</span>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 transition px-3 py-1.5 rounded-lg text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
