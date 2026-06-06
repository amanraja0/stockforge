import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

import { useAuth } from "../context/AuthContext";

import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [mode, setMode] = useState("login");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (mode === "login") {
        const response = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        login(response.data.user, response.data.token);

        toast.success("Login successful");

        navigate("/dashboard");
      } else {
        await api.post("/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        toast.success("Registration successful. You can log in now.");

        setMode("login");
        setFormData({
          name: "",
          email: formData.email,
          password: "",
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Request failed";

      if (mode === "register" && errorMessage === "User already exists") {
        toast.error("User already exists. Please log in instead.");
        setMode("login");
      } else {
        toast.error(
          errorMessage ||
            (mode === "login" ? "Login failed" : "Registration failed"),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-6 rounded-2xl w-full max-w-md shadow-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              mode === "login"
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => setMode("register")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              mode === "register"
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Register
          </button>
        </div>

        <h1 className="text-2xl font-semibold mb-2 tracking-tight">
          {mode === "login" ? "StockForge Login" : "Create New Account"}
        </h1>

        {mode === "register" && (
          <p className="text-sm text-slate-400 mb-4">
            New registrations are created as STAFF by default. Contact your
            administrator if you need ADMIN access.
          </p>
        )}

        {mode === "register" && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded-lg bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none"
            required
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 p-3 rounded-lg font-medium"
        >
          {loading
            ? mode === "login"
              ? "Logging in..."
              : "Creating account..."
            : mode === "login"
              ? "Login"
              : "Register"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
