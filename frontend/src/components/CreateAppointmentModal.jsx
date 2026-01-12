import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  UserCheck,
  Building2,
} from "lucide-react";
import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useAppointments } from "../context/AppointmentsContext";

const CreateAppointmentModal = ({ open, onClose }) => {
  if (!open) return null;

  // 🔐 Logged-in user (host)
  const user = JSON.parse(localStorage.getItem("user"));
  const { refetch } = useAppointments(); // ✅ CONTEXT

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    purpose: "",
    whomToMeet: "",
    date: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.phone ||
      !form.email ||
      !form.purpose ||
      !form.date
    ) {
      return toast.error("Please fill all required fields");
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        hostId: user?.id || null,
        hostName: user?.name || null,
      };

      await api.post("/appointments/invite", payload);

      toast.success("Appointment created successfully");

      await refetch(); // ✅ instant dashboard update
      onClose();

      setForm({
        name: "",
        phone: "",
        email: "",
        purpose: "",
        whomToMeet: "",
        date: "",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-linear-to-r from-gray-900 to-gray-800 px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">
              Create New Appointment
            </h2>
            <p className="text-gray-300 text-sm mt-1">
              Schedule a visitor appointment
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-6 max-h-[70vh] overflow-y-auto"
        >
          <div className="space-y-5">
            {/* Visitor Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Visitor Information
              </h3>

              <div className="space-y-3">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="w-full p-3 border rounded-lg"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className="w-full p-3 border rounded-lg"
                  />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    required
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Appointment Details
              </h3>

              <input
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                placeholder="Purpose of Visit"
                required
                className="w-full p-3 border rounded-lg mb-3"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="whomToMeet"
                  value={form.whomToMeet}
                  onChange={handleChange}
                  placeholder="Whom to Meet"
                  className="w-full p-3 border rounded-lg"
                />
                <input
                  name="date"
                  type="datetime-local"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>

            {/* Host Info */}
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-sm">
                <strong>Host:</strong> {user?.name || "N/A"}
              </p>
              <p className="text-xs text-gray-500">ID: {user?.id || "N/A"}</p>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAppointmentModal;
