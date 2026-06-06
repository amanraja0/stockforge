import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import PageHeading from "../components/PageHeading";
import ConfirmationModal from "../components/ConfirmationModal";
import { useAuth } from "../context/AuthContext";

import api from "../services/api";

import toast from "react-hot-toast";

const UsersPage = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);

  const [activityLogs, setActivityLogs] = useState([]);

  const [pendingDeleteUser, setPendingDeleteUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STAFF",
  });

  const [loading, setLoading] = useState(false);

  const [usersLoading, setUsersLoading] = useState(true);

  const [activityLogsLoading, setActivityLogsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);

      const response = await api.get("/auth/users");

      setUsers(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      setActivityLogsLoading(true);

      const response = await api.get("/auth/user-activity-logs");

      setActivityLogs(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch logs");
    } finally {
      setActivityLogsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchUsers();
      fetchActivityLogs();
    }
  }, [user?.role]);

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

      await api.post("/auth/users", formData);

      toast.success("User created successfully");

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "STAFF",
      });

      fetchUsers();
      fetchActivityLogs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (entry) => {
    try {
      await api.delete(`/auth/users/${entry.id}`);

      toast.success(`${entry.name} deleted by ${user?.name}`);

      setPendingDeleteUser(null);

      fetchUsers();
      fetchActivityLogs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  if (user?.role !== "ADMIN") {
    return (
      <DashboardLayout>
        <PageHeading>Users</PageHeading>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 text-slate-300">
          Access denied. Only admin users can create new users.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeading>Users</PageHeading>

      <ConfirmationModal
        open={Boolean(pendingDeleteUser)}
        title="Confirm delete action"
        message={
          pendingDeleteUser
            ? `Delete ${pendingDeleteUser.name}? This will be recorded as deleted by ${user?.name}.`
            : ""
        }
        confirmLabel="Confirm Delete"
        cancelLabel="Cancel"
        onConfirm={() => handleDeleteUser(pendingDeleteUser)}
        onCancel={() => setPendingDeleteUser(null)}
      />

      <form
        className="bg-slate-800 border border-slate-700 p-4 rounded-2xl shadow-lg max-w-2xl"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-3">Create User</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none p-2.5 rounded-lg text-sm"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none p-2.5 rounded-lg text-sm"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none p-2.5 rounded-lg text-sm"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none p-2.5 pr-10 rounded-lg appearance-none text-sm"
            required
          >
            <option value="STAFF">STAFF</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 px-4 py-2 rounded-lg mt-4 text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>

      <div className="mt-6 bg-slate-800 border border-slate-700 rounded-2xl overflow-x-auto shadow-lg">
        <div className="px-4 py-3 border-b border-slate-700">
          <h2 className="text-xl font-bold">All Users</h2>
        </div>

        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Created At</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {usersLoading ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-slate-400">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-slate-400">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="p-4">{entry.name}</td>
                  <td className="p-4">{entry.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        entry.role === "ADMIN"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {entry.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-300">
                    {new Date(entry.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    {entry.role === "STAFF" ? (
                      <button
                        type="button"
                        onClick={() => setPendingDeleteUser(entry)}
                        className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="text-sm text-slate-500">Protected</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-slate-800 border border-slate-700 rounded-2xl overflow-x-auto shadow-lg">
        <div className="px-4 py-3 border-b border-slate-700">
          <h2 className="text-xl font-bold">User Activity Logs</h2>
        </div>

        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              <th className="p-4 text-left">Action</th>
              <th className="p-4 text-left">Method</th>
              <th className="p-4 text-left">Target User</th>
              <th className="p-4 text-left">Actor</th>
              <th className="p-4 text-left">Created At</th>
            </tr>
          </thead>

          <tbody>
            {activityLogsLoading ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-slate-400">
                  Loading activity logs...
                </td>
              </tr>
            ) : activityLogs.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-slate-400">
                  No activity logs found
                </td>
              </tr>
            ) : (
              activityLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        log.action === "CREATE"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>

                  <td className="p-4">{log.method}</td>

                  <td className="p-4">
                    <div className="font-medium">{log.targetUserName}</div>
                    <div className="text-xs text-slate-400">
                      {log.targetUserEmail} • {log.targetUserRole}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-medium">{log.actorUserName}</div>
                    <div className="text-xs text-slate-400">
                      {log.actorUserRole}
                    </div>
                  </td>

                  <td className="p-4 text-sm text-slate-300">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
