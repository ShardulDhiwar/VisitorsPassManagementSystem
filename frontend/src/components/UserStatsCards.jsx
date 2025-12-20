import { ClipboardList, ShieldUser, User, UserRound, UserRoundCog, UserStar } from "lucide-react";

const StatCard = ({ title, value, icon }) => (
  // <div className="p-5 rounded-xl shadow bg-white border-l-4 border-green-500">
  //   <div className="text-2xl">{icon}</div>
  //   <p className="text-xl text-black font-bold">{title}</p>
  //   <p className={`text-2xl font-bold`}>{value}</p>
  // </div>
  <div className="p-5 rounded-xl shadow bg-white border-l-4 border-green-500">
    <div className="flex items-center gap-3">
      <div className="text-2xl">{icon}</div>
      <h3 className="text-gray-600 font-medium">{title}</h3>
    </div>
    <p className="text-3xl font-bold mt-3">{value}</p>
  </div>
);

const UserStatsCards = ({ users }) => {
  const total = users.length;
  const admins = users.filter((u) => u.role === "ADMIN").length;
  const security = users.filter((u) => u.role === "SECURITY").length;
  const employees = users.filter((u) => u.role === "EMPLOYEE").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard title="Total Users" value={total} icon={<ClipboardList />} />
      <StatCard title="Admins" value={admins} icon={<UserRoundCog />} />
      <StatCard title="Security" value={security} icon={<ShieldUser />} />
      <StatCard title="Employees" value={employees} icon={<UserRound />} />
    </div>
  );
};

export default UserStatsCards;
