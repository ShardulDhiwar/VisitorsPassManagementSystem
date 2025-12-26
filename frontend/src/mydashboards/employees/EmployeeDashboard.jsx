// import { useEffect, useState } from "react";
// import api from "../../api/axios";
// import { toast } from "react-toastify";

// const EmployeeDashboard = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(false);

//   /* ---------------- FETCH APPOINTMENTS ---------------- */

//   const fetchAppointments = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/appointments");
//       setAppointments(res.data.data);
//     } catch (err) {
//       toast.error("Failed to load appointments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   /* ---------------- KPI COUNTS ---------------- */

//   const total = appointments.length;
//   const pending = appointments.filter((a) => a.status === "pending").length;
//   const approved = appointments.filter((a) => a.status === "approved").length;
//   const rejected = appointments.filter((a) => a.status === "rejected").length;

//   /* ---------------- UPDATE STATUS ---------------- */

//   const updateStatus = async (id, status) => {
//     try {
//       await api.put(`/appointments/${id}/status`, { status });
//       toast.success(`Appointment ${status}`);
//       fetchAppointments();
//     } catch (err) {
//       toast.error("Status update failed");
//     }
//   };

//   /* ---------------- UI ---------------- */

//   return (
//     <div className="p-6 max-w-7xl mx-auto space-y-6">
//       <h1 className="text-2xl font-semibold">Employee Dashboard</h1>

//       {/* KPI CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {[
//           {
//             label: "Total Appointments",
//             value: total,
//             color: "bg-blue-100 text-blue-700",
//           },
//           {
//             label: "Pending",
//             value: pending,
//             color: "bg-yellow-100 text-yellow-700",
//           },
//           {
//             label: "Approved",
//             value: approved,
//             color: "bg-green-100 text-green-700",
//           },
//           {
//             label: "Rejected",
//             value: rejected,
//             color: "bg-red-100 text-red-700",
//           },
//         ].map((item, i) => (
//           <div key={i} className={`p-4 rounded-xl shadow ${item.color}`}>
//             <p className="text-sm">{item.label}</p>
//             <p className="text-2xl font-bold">{item.value}</p>
//           </div>
//         ))}
//       </div>

//       {/* CREATE APPOINTMENT */}
//       <div className="flex justify-end">
//         <button className="bg-blue-600 text-white px-4 py-2 rounded">
//           + Create Appointment
//         </button>
//       </div>

//       {/* APPOINTMENTS TABLE */}
//       <div className="bg-white rounded-xl shadow overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-100 text-left">
//             <tr>
//               <th className="p-3">Visitor</th>
//               <th className="p-3">Purpose</th>
//               <th className="p-3">Date</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {appointments.map((a) => (
//               <tr key={a._id} className="border-t">
//                 <td className="p-3">{a.visitorId?.name || "—"}</td>

//                 <td className="p-3">{a.purpose}</td>

//                 <td className="p-3">{new Date(a.date).toLocaleDateString()}</td>

//                 <td className="p-3 capitalize">{a.status}</td>

//                 <td className="p-3">
//                   {a.status === "pending" ? (
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => updateStatus(a._id, "approved")}
//                         className="bg-green-600 text-white px-3 py-1 rounded"
//                       >
//                         Approve
//                       </button>

//                       <button
//                         onClick={() => updateStatus(a._id, "rejected")}
//                         className="bg-red-600 text-white px-3 py-1 rounded"
//                       >
//                         Reject
//                       </button>
//                     </div>
//                   ) : (
//                     <span className="text-gray-400">—</span>
//                   )}
//                 </td>
//               </tr>
//             ))}

//             {appointments.length === 0 && !loading && (
//               <tr>
//                 <td colSpan="5" className="p-4 text-center text-gray-500">
//                   No appointments found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default EmployeeDashboard;


import { ClipboardList, Clock, CheckCircle, XCircle } from "lucide-react";

import StatsCard from "../../components/StatsCard";
import AppointmentsTable from "../../components/AppointmentsTable";
import { useAppointments } from "../../context/AppointmentsContext";

const EmployeeDashboard = () => {
  const { stats } = useAppointments();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Employee Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="My Appointments"
          value={stats.total}
          icon={<ClipboardList />}
          bg="border-blue-500"
        />

        <StatsCard
          title="Pending Requests"
          value={stats.pending}
          icon={<Clock />}
          bg="border-yellow-500"
        />

        <StatsCard
          title="Approved"
          value={stats.approved}
          icon={<CheckCircle />}
          bg="border-green-500"
        />

        <StatsCard
          title="Rejected"
          value={stats.rejected}
          icon={<XCircle />}
          bg="border-red-500"
        />
      </div>

      {/* ACTION BAR */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">My Appointments</h2>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          + Create Appointment
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow p-4">
        <AppointmentsTable role="EMPLOYEE" />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
