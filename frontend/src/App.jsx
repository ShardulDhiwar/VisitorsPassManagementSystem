import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./routing/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminDashboard from "./mydashboards/admin/AdminDashboard.jsx";
import VisitorsForm from "./pages/VisitorsForm";
import { ToastContainer } from "react-toastify";
import { AppointmentsProvider } from "./context/AppointmentsContext";
import UsersPage from "./components/UserPage.jsx";
import LogsPage from "./components/LogsPage.jsx";
import SecurityDashboard from "./mydashboards/security/SecurityDashboard.jsx";
import EmployeeDashboard from "./mydashboards/employees/EmployeeDashboard.jsx";

function App() {
  return (
    <AppointmentsProvider>
      {" "}
      {/* ✅ Wrap whole app */}
      <BrowserRouter>
        <Routes>
          {/* PUBLIC */}
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
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="logs" element={<LogsPage />} />
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
            <Route index element={<SecurityDashboard />} />
            <Route path="logs" element={<LogsPage />} />
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
            <Route index element={<EmployeeDashboard />} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<LoginPage />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={2000} />
      </BrowserRouter>
    </AppointmentsProvider>
  );
}

export default App;
