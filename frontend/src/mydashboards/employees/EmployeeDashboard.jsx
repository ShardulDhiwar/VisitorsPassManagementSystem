import { useState } from "react";
import { ClipboardList, Clock, CheckCircle, XCircle, Plus } from "lucide-react";

import StatsCard from "../../components/StatsCard";
import AppointmentsTable from "../../components/AppointmentsTable";
import CreateAppointmentModal from "../../components/CreateAppointmentModal";
import { useAppointments } from "../../context/AppointmentsContext";

const EmployeeDashboard = () => {
  const { stats, loading } = useAppointments();
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Employee Dashboard</h1>

        <button
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-2 rounded"
        >
          <Plus size={18} />
          Create Appointment
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="My Appointments"
          value={stats.total}
          icon={<ClipboardList />}
          bg="border-blue-500"
        />
        <StatsCard
          title="Pending"
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

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">My Appointments</h2>

        <AppointmentsTable role="EMPLOYEE" />
      </div>

      {/* CREATE MODAL */}
      <CreateAppointmentModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
    </div>
  );
};

export default EmployeeDashboard;
