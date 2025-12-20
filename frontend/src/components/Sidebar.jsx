import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import GateKeeperWhite from "../assets/GateKeeperWhite.png";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const adminMenu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/admin/users" },
    { name: "Logs", path: "/admin/logs" },
  ];

  const securityMenu = [
    { name: "Dashboard", path: "/security" },
    { name: "Logs", path: "/security/logs" },
  ];

  const employeeMenu = [{ name: "Dashboard", path: "/employee" }];

  const menu =
    user.role === "ADMIN"
      ? adminMenu
      : user.role === "SECURITY"
      ? securityMenu
      : employeeMenu;

  return (
    <aside className="w-64 bg-[#017d48] p-5 flex flex-col">
      <div className="flex items-center mb-4">
        <img
          src={GateKeeperWhite}
          alt="GateKeeper Logo"
          className="w-10 h-auto"
        />
        <h2 className="text-white text-3xl font-bold m-1 mb-3">GateKeeper</h2>
      </div>

      <nav className="flex-1 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive ? "bg-green-500 text-black" : "hover:bg-[#204d45]"
              } text-white`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto bg-red-500 text-black py-2 rounded"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
