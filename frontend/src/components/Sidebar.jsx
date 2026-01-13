import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import GateKeeperWhite from "../assets/GateKeeperWhite.png";
import { LayoutDashboard, Users, FileText, Shield, LogOut } from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const adminMenu = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Logs", path: "/admin/logs", icon: <FileText size={20} /> },
  ];

  const securityMenu = [
    { name: "Dashboard", path: "/security", icon: <Shield size={20} /> },
    { name: "Logs", path: "/security/logs", icon: <FileText size={20} /> },
  ];

  const employeeMenu = [
    {
      name: "Dashboard",
      path: "/employee",
      icon: <LayoutDashboard size={20} />,
    },
  ];

  const menu =
    user.role === "ADMIN"
      ? adminMenu
      : user.role === "SECURITY"
      ? securityMenu
      : employeeMenu;

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-5 flex flex-col shadow-2xl">
      {/* Logo Section */}
      <div className="flex items-center mb-8 pb-4 border-b border-gray-700">
        <img
          src={GateKeeperWhite}
          alt="GateKeeper Logo"
          className="w-10 h-auto"
        />
        <h2 className="text-white text-3xl font-bold ml-3">GateKeeper</h2>
      </div>

      {/* User Info */}
      <div className="mb-6 p-3 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-gray-400 text-xs mb-1">Logged in as</p>
        <p className="text-white font-semibold">{user.name}</p>
        <p className="text-gray-400 text-sm">{user.role}</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 mt-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <LogOut size={20} />
        <span className="font-medium">Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
