import { ClipboardList, Clock, CheckCircle, Users } from "lucide-react";

import StatsCard from "../../components/StatsCard";
import AppointmentsTable from "../../components/AppointmentsTable";
import { useAppointments } from "../../context/AppointmentsContext";

const AdminDashboard = () => {
  const { stats } = useAppointments();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Appointments"
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
          title="Visitors Inside"
          value={stats.inside}
          icon={<Users />}
          bg="border-purple-500"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">
          Recent Appointment Requests
        </h2>
        <AppointmentsTable />
      </div>
    </div>
  );
};

export default AdminDashboard;
