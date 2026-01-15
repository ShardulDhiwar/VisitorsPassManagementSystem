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
    <div className="p-6 pb-0 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Employee Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Manage your appointments</p>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-3 rounded-lg transition-all duration-150 shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          <span className="font-medium">Create Appointment</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-lg px-6 py-2">
        <div className="mb-2">
          <h2 className="text-xl font-semibold text-gray-800">
            My Appointments
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            View and track all your appointments
          </p>
        </div>

        <AppointmentsTable />
      </div>

      {/* Create Modal */}
      <CreateAppointmentModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
    </div>
  );
};

export default EmployeeDashboard;
