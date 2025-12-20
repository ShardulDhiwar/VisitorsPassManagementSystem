import { useEffect, useState } from "react";
import api from "../api/axios";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import UserStatsCards from "./UserStatsCards";

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

  /* -------------------- FORM HANDLERS -------------------- */

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
        // UPDATE USER
        await api.put(`/users/${selectedUser._id}`, {
          name: form.name,
          email: form.email,
          role: form.role,
        });
        toast.success("User updated");
      } else {
        // CREATE USER
        await api.post("/auth/register", form);
        toast.success("User created");
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
    if (!confirm("Delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
        <UserStatsCards users={users} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* USERS TABLE */}
          <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Users</h2>

            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {currentusers.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleEdit(u)}
                  >
                    <td className="p-3">{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td className="text-right pr-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(u._id);
                        }}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION CONTROL */}
            <div className="flex justify-evenly items-center mt-4 text-sm">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Previous
              </button>

              <span>
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </span>

              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">
              {selectedUser ? "Edit User" : "Create User"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />

              {!selectedUser && (
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                />
              )}

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="ADMIN">Admin</option>
                <option value="SECURITY">Security</option>
                <option value="EMPLOYEE">Employee</option>
              </select>

              <div className="flex gap-2">
                <button className="flex-1 bg-green-600 text-white py-2 rounded">
                  {selectedUser ? "Update" : "Create"}
                </button>

                {selectedUser && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 py-2 rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersPage;
