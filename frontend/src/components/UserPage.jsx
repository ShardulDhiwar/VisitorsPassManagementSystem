import { useEffect, useState } from "react";
import StatCard from "./StatsCard";
import api from "../api/axios";
import {
  ClipboardList,
  ShieldUser,
  UserRound,
  UserRoundCog,
  Trash2,
  Edit,
} from "lucide-react";
import { toast } from "react-toastify";

const ROWS_PER_PAGE = 6;

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "EMPLOYEE",
    password: "",
  });

  const totalPages = Math.ceil(users.length / ROWS_PER_PAGE);
  const startIndex = (page - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const currentusers = users.slice(startIndex, endIndex);

  const total = users.length;
  const admins = users.filter((u) => u.role === "ADMIN").length;
  const security = users.filter((u) => u.role === "SECURITY").length;
  const employees = users.filter((u) => u.role === "EMPLOYEE").length;

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.data);
    } catch (err) {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setSelectedUser(null);
    setForm({
      name: "",
      email: "",
      role: "EMPLOYEE",
      password: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedUser) {
        await api.put(`/users/${selectedUser._id}`, {
          name: form.name,
          email: form.email,
          role: form.role,
        });
        toast.success("User updated successfully");
      } else {
        await api.post("/auth/register", form);
        toast.success("User created successfully");
      }

      resetForm();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={total}
          icon={<ClipboardList size={20} />}
        />
        <StatCard
          title="Admins"
          value={admins}
          icon={<UserRoundCog size={20} />}
        />
        <StatCard
          title="Security"
          value={security}
          icon={<ShieldUser size={20} />}
        />
        <StatCard
          title="Employees"
          value={employees}
          icon={<UserRound size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users Table */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Name
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Email
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Role
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {currentusers.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-sm text-gray-900">{u.name}</td>
                  <td className="p-4 text-sm text-gray-900">{u.email}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${
                        u.role === "ADMIN"
                          ? "bg-green-100 text-green-700"
                          : u.role === "SECURITY"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(u)}
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                        title="Edit User"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(u._id);
                        }}
                        className="text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 p-4 border-t border-gray-200">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &lt; Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  page === i + 1
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            {totalPages > 3 && <span className="text-gray-400">...</span>}

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next &gt;
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-6 text-gray-900">
            {selectedUser ? "Edit User" : "Create New User"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                name="name"
                placeholder="Enter full name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter email address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {!selectedUser && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="ADMIN">Admin</option>
                <option value="SECURITY">Security</option>
                <option value="EMPLOYEE">Employee</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg text-sm font-medium transition-all"
              >
                {selectedUser ? "Update User" : "Create User"}
              </button>

              {selectedUser && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2.5 rounded-lg text-sm font-medium transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
