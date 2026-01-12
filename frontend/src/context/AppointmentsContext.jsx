import { createContext, useContext, useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { generateQrBase64 } from "../utils/qr";
import { sendApprovedEmail, sendRejectedEmail } from "../utils/emailjs";

const AppointmentsContext = createContext();

export const AppointmentsProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔁 prevent overlapping API calls
  const isFetching = useRef(false);

  /* =========================
     FETCH APPOINTMENTS
  ========================== */
  const fetchAppointments = async () => {
    if (isFetching.current) return;

    try {
      isFetching.current = true;
      setLoading(true);

      let res;
      if (user?.role === "ADMIN") {
        res = await api.get("/appointments/all");
      } else {
        res = await api.get("/appointments");
      }

      setAppointments(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  };

  /* =========================
     UPDATE STATUS + EMAIL
  ========================== */
  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/appointments/${id}/status`, { status });

      const { appointment, pass } = res.data.data;

      // ✅ APPROVED → generate QR + send email
      if (status === "approved" && pass) {
        const qrImage = await generateQrBase64(pass.token);

        await sendApprovedEmail({
          to_email: appointment.visitorId.email,
          visitor_name: appointment.visitorId.name,
          host_name: appointment.hostName,
          date: new Date(appointment.date).toLocaleString(),
          purpose: appointment.purpose,
          pass_token: pass.token,
          qr_image: qrImage,
        });
      }

      // ❌ REJECTED → rejection email
      if (status === "rejected") {
        await sendRejectedEmail({
          to_email: appointment.visitorId.email,
          visitor_name: appointment.visitorId.name,
          host_name: appointment.hostName,
          date: new Date(appointment.date).toLocaleString(),
          purpose: appointment.purpose,
        });
      }

      // Optimistic UI update
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, status } : a
        )
      );
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  /* =========================
     🔁 POLLING (NO WEBSOCKETS)
  ========================== */
  useEffect(() => {
    fetchAppointments(); // initial load

    const interval = setInterval(() => {
      fetchAppointments();
    }, 5000); // ⏱ every 5 seconds

    return () => clearInterval(interval);
  }, []);

  /* =========================
     STATS
  ========================== */
  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    approved: appointments.filter((a) => a.status === "approved").length,
    rejected: appointments.filter((a) => a.status === "rejected").length,
    inside: appointments.filter((a) => a.visitorId?.isInside).length,
  };

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        loading,
        stats,
        updateStatus,
        refetch: fetchAppointments, // manual refresh if needed
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
};

export const useAppointments = () => useContext(AppointmentsContext);
