import { Check, X, Eye } from "lucide-react";
import { useState } from "react";
import { useAppointments } from "../context/AppointmentsContext";
import AppointmentDetailsModal from "./AppointmentDetailsModal";

const ROWS_PER_PAGE = 5;

const statusColor = {
  PENDING: "bg-[#f6f4e8] text-black",
  APPROVED: "bg-green-500 text-white",
  REJECTED: "bg-red-500 text-white",
};

const AppointmentsTable = () => {
  const { appointments, loading, updateStatus } = useAppointments();

  const [page, setPage] = useState(1);

  // 🔹 Modal state
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
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm">
              <th className="p-3">Visitor</th>
              <th className="p-3">Purpose</th>
              <th className="p-3">Host</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentAppointments.map((item) => {
              console.log(item);
              const status = item.status.toUpperCase();

              return (
                <tr key={item._id} className="border-b text-sm">
                  <td className="p-3">{item.visitorId?.name || "—"}</td>
                  <td className="p-3">{item.purpose}</td>
                  <td className="p-3">{item.hostName}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${statusColor[status]}`}
                    >
                      {status}
                    </span>
                  </td>

                  <td className="p-3 space-x-2 flex items-center">
                    {/* 👁 VIEW DETAILS (always enabled) */}
                    <button
                      onClick={() => openDetails(item)}
                      title="View details"
                    >
                      <Eye className="text-black" size={18} />
                    </button>

                    {/* ✅❌ ACTIONS (only pending) */}
                    {status === "PENDING" && (
                      <>
                        <button
                          onClick={() => updateStatus(item._id, "approved")}
                        >
                          <Check className="text-green-500" />
                        </button>

                        <button
                          onClick={() => updateStatus(item._id, "rejected")}
                        >
                          <X className="text-red-500" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* PAGINATION */}
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

      {/* 🔍 DETAILS MODAL */}
      <AppointmentDetailsModal
        open={showDetails}
        onClose={() => setShowDetails(false)}
        appointment={selectedAppointment}
      />
    </>
  );
};

export default AppointmentsTable;
