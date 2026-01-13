// import { Check, X, Eye } from "lucide-react";
// import { useState } from "react";
// import { useAppointments } from "../context/AppointmentsContext";
// import AppointmentDetailsModal from "./AppointmentDetailsModal";

// const ROWS_PER_PAGE = 5;

// const statusColor = {
//   PENDING: "bg-[#f6f4e8] text-black",
//   APPROVED: "bg-green-500 text-white",
//   REJECTED: "bg-red-500 text-white",
// };

// const AppointmentsTable = () => {
//   const { appointments, loading, updateStatus } = useAppointments();

//   const [page, setPage] = useState(1);

//   // 🔹 Modal state
//   const [showDetails, setShowDetails] = useState(false);
//   const [selectedAppointment, setSelectedAppointment] = useState(null);

//   if (loading) {
//     return <p className="text-gray-500">Loading appointments...</p>;
//   }

//   const totalPages = Math.ceil(appointments.length / ROWS_PER_PAGE);
//   const startIndex = (page - 1) * ROWS_PER_PAGE;
//   const endIndex = startIndex + ROWS_PER_PAGE;
//   const currentAppointments = appointments.slice(startIndex, endIndex);

//   const openDetails = (appointment) => {
//     setSelectedAppointment(appointment);
//     setShowDetails(true);
//   };

//   return (
//     <>
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-100 text-left text-sm">
//               <th className="p-3">Visitor</th>
//               <th className="p-3">Purpose</th>
//               <th className="p-3">Host</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {currentAppointments.map((item) => {
//               console.log(item);
//               const status = item.status.toUpperCase();

//               return (
//                 <tr key={item._id} className="border-b text-sm">
//                   <td className="p-3">{item.visitorId?.name || "—"}</td>
//                   <td className="p-3">{item.purpose}</td>
//                   <td className="p-3">{item.hostName}</td>

//                   <td className="p-3">
//                     <span
//                       className={`px-2 py-1 rounded text-xs font-semibold ${statusColor[status]}`}
//                     >
//                       {status}
//                     </span>
//                   </td>

//                   <td className="p-3 space-x-2 flex items-center">
//                     {/* 👁 VIEW DETAILS (always enabled) */}
//                     <button
//                       onClick={() => openDetails(item)}
//                       title="View details"
//                     >
//                       <Eye
//                         className="text-black hover: cursor-pointer"
//                         size={18}
//                       />
//                     </button>

//                     {/* ACTIONS (only pending) */}
//                     {status === "PENDING" && (
//                       <>
//                         <button
//                           onClick={() => updateStatus(item._id, "approved")}
//                         >
//                           <Check className="text-green-500 hover: cursor-pointer" />
//                         </button>

//                         <button
//                           onClick={() => updateStatus(item._id, "rejected")}
//                         >
//                           <X className="text-red-500 hover: cursor-pointer" />
//                         </button>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         {/* PAGINATION */}
//         <div className="flex justify-evenly items-center mt-4 text-sm">
//           <button
//             onClick={() => setPage((p) => Math.max(p - 1, 1))}
//             disabled={page === 1}
//             className="px-3 py-1 border rounded disabled:opacity-40"
//           >
//             Previous
//           </button>

//           <span>
//             Page <strong>{page}</strong> of <strong>{totalPages}</strong>
//           </span>

//           <button
//             onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
//             disabled={page === totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-40"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* 🔍 DETAILS MODAL */}
//       <AppointmentDetailsModal
//         open={showDetails}
//         onClose={() => setShowDetails(false)}
//         appointment={selectedAppointment}
//       />
//     </>
//   );
// };

// export default AppointmentsTable;


import { Check, X, Eye } from "lucide-react";
import { useState } from "react";
import { useAppointments } from "../context/AppointmentsContext";
import AppointmentDetailsModal from "./AppointmentDetailsModal";

const ROWS_PER_PAGE = 6;

const statusStyles = {
  PENDING: "bg-gray-100 text-gray-700",
  APPROVED: "bg-white text-gray-700 border border-gray-200",
  REJECTED: "bg-red-500 text-white",
};

const AppointmentsTable = () => {
  const { appointments, loading, updateStatus } = useAppointments();

  const [page, setPage] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  if (loading) {
    return <p className="text-gray-500">Loading appointments...</p>;
  }

  const totalPages = Math.ceil(appointments.length / ROWS_PER_PAGE);
  const startIndex = (page - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const currentAppointments = appointments.slice(startIndex, endIndex);

  const openDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetails(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Visitor
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Purpose
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Host
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {currentAppointments.map((item) => {
              const status = item.status.toUpperCase();

              return (
                <tr
                  key={item._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-sm text-gray-900">
                    {item.visitorId?.name || "—"}
                  </td>
                  <td className="p-4 text-sm text-gray-900">{item.purpose}</td>
                  <td className="p-4 text-sm text-gray-900">{item.hostName}</td>

                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${statusStyles[status]}`}
                    >
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openDetails(item)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        title="View details"
                      >
                        <Eye size={18} />
                      </button>

                      {status === "PENDING" && (
                        <>
                          <button
                            onClick={() => updateStatus(item._id, "approved")}
                            className="text-gray-600 hover:text-green-600 transition-colors"
                            title="Approve"
                          >
                            <Check size={18} />
                          </button>

                          <button
                            onClick={() => updateStatus(item._id, "rejected")}
                            className="text-gray-600 hover:text-red-600 transition-colors"
                            title="Reject"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
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

      <AppointmentDetailsModal
        open={showDetails}
        onClose={() => setShowDetails(false)}
        appointment={selectedAppointment}
      />
    </>
  );
};

export default AppointmentsTable;