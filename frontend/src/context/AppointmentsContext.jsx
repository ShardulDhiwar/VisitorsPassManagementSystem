import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AppointmentsContext = createContext();

export const AppointmentsProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments/all");
      setAppointments(res.data.data);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });

      setAppointments((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, status: status.toLowerCase() } : a
        )
      );
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ DERIVED STATS (NO BUGS)
  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    approved: appointments.filter((a) => a.status === "approved").length,
    rejected: appointments.filter((a) => a.status === "rejected").length,
    inside: appointments.filter((a) => a.visitorId?.isInside).length,
  };

  return (
    <AppointmentsContext.Provider
      value={{ appointments, loading, stats, updateStatus }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
};

export const useAppointments = () => useContext(AppointmentsContext);
