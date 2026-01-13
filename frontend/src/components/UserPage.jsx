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

const ROWS_PER_PAGE = 5;

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
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">User Management</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={total}
          icon={<ClipboardList />}
          bg="border-blue-500"
        />
        <StatCard
          title="Admins"
          value={admins}
          icon={<UserRoundCog />}
          bg="border-green-500"
        />
        <StatCard
          title="Security"
          value={security}
          icon={<ShieldUser />}
          bg="border-red-500"
        />
        <StatCard
          title="Employees"
          value={employees}
          icon={<UserRound />}
          bg="border-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            All Users
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="p-4 text-left font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="p-4 text-left font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="p-4 text-left font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentusers.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="p-4 font-medium text-gray-800">{u.name}</td>
                    <td className="p-4 text-gray-600">{u.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(u)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                          title="Edit User"
                        >
                          <Edit size={16} className="text-blue-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(u._id);
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-150"
                          title="Delete User"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 text-sm">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-150"
            >
              Previous
            </button>

            <span className="text-gray-600">
              Page <strong className="text-gray-800">{page}</strong> of{" "}
              <strong className="text-gray-800">{totalPages}</strong>
            </span>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-150"
            >
              Next
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
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
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150"
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
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150"
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
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150"
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
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150"
              >
                <option value="ADMIN">Admin</option>
                <option value="SECURITY">Security</option>
                <option value="EMPLOYEE">Employee</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg font-medium transition-all duration-150 shadow-md hover:shadow-lg"
              >
                {selectedUser ? "Update User" : "Create User"}
              </button>

              {selectedUser && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-medium transition-all duration-150"
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
