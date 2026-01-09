// import { createContext, useContext, useEffect, useState } from "react";
// import api from "../api/axios";

// const AppointmentsContext = createContext();

// export const AppointmentsProvider = ({ children }) => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchAppointments = async () => {
//     try {
//       const res = await api.get("/appointments/all");
//       setAppointments(res.data.data);
//     } catch (err) {
//       console.error("Failed to fetch appointments", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateStatus = async (id, status) => {
//     try {
//       await api.put(`/appointments/${id}/status`, { status });

//       setAppointments((prev) =>
//         prev.map((a) =>
//           a._id === id ? { ...a, status: status.toLowerCase() } : a
//         )
//       );
//     } catch (err) {
//       console.error("Status update failed", err);
//     }
//   };

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   // ✅ DERIVED STATS (NO BUGS)
//   const stats = {
//     total: appointments.length,
//     pending: appointments.filter((a) => a.status === "pending").length,
//     approved: appointments.filter((a) => a.status === "approved").length,
//     rejected: appointments.filter((a) => a.status === "rejected").length,
//     inside: appointments.filter((a) => a.visitorId?.isInside).length,
//   };

//   return (
//     <AppointmentsContext.Provider
//       value={{ appointments, loading, stats, updateStatus }}
//     >
//       {children}
//     </AppointmentsContext.Provider>
//   );
// };

// export const useAppointments = () => useContext(AppointmentsContext);


import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { sendApprovedEmail, sendRejectedEmail } from "../utils/emailjs";

const AppointmentsContext = createContext();

export const AppointmentsProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  /* =========================
     FETCH APPOINTMENTS
  ========================== */
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      let res;

      if (user?.role === "ADMIN") {
        res = await api.get("/appointments/all");
      } else {
        res = await api.get("/appointments");
      }

      setAppointments(res.data.data);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UPDATE STATUS + EMAIL
  ========================== */
  const updateStatus = async (id, status) => {
    try {
      // 1️⃣ Update status in backend
      const res = await api.put(`/appointments/${id}/status`, { status });

      const { appointment, pass } = res.data.data;

      // 2️⃣ APPROVED → send pass email
      if (status === "approved" && pass) {
        await sendApprovedEmail({
          to_email: appointment.visitorId.email,
          visitor_name: appointment.visitorId.name,
          host_name: appointment.hostName,
          date: new Date(appointment.date).toLocaleString(),
          purpose: appointment.purpose,
          pass_token: pass.token,
        });
      }

      // 3️⃣ REJECTED → send rejection email
      if (status === "rejected") {
        await sendRejectedEmail({
          to_email: appointment.visitorId.email,
          visitor_name: appointment.visitorId.name,
          host_name: appointment.hostName,
          date: new Date(appointment.date).toLocaleString(),
          purpose: appointment.purpose,
        });
      }

      // 4️⃣ Update UI state
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
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
        refetch: fetchAppointments,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
};

export const useAppointments = () => useContext(AppointmentsContext);


