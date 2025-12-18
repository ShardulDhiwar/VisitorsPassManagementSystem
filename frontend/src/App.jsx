import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./routing/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import VisitorsForm from "./pages/VisitorsForm";

// Dummy pages
const AdminHome = () => <h1>Admin Dashboard</h1>;
const Users = () => <h1>Users</h1>;
const Logs = () => <h1>Logs</h1>;

const SecurityHome = () => <h1>Security Dashboard</h1>;
const EmployeeHome = () => <h1>Employee Dashboard</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/visitorsForm" element={<VisitorsForm />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="users" element={<Users />} />
          <Route path="logs" element={<Logs />} />
        </Route>

        {/* SECURITY */}
        <Route
          path="/security"
          element={
            <ProtectedRoute allowedRoles={["SECURITY"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SecurityHome />} />
        </Route>

        {/* EMPLOYEE */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EmployeeHome />} />
        </Route>

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
