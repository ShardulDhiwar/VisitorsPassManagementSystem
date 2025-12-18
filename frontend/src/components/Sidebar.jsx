import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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

  const securityMenu = [{ name: "Dashboard", path: "/security" }];

  const employeeMenu = [{ name: "Dashboard", path: "/employee" }];

  const menu =
    user.role === "ADMIN"
      ? adminMenu
      : user.role === "SECURITY"
      ? securityMenu
      : employeeMenu;

  return (
    <aside className="w-64 bg-[#42f760] p-5 flex flex-col">
      <h2 className="text-2xl mb-6 text-white underline">GateKeeper</h2>

      <nav className="flex-1 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive ? "bg-green-500 text-black" : "hover:bg-[#204d45]"
              }`
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
