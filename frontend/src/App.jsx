import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./routing/ProtectedRoute";

// Dummy pages for now
const AdminDashboard = () => <h1>Admin Dashboard</h1>;
const SecurityDashboard = () => <h1>Security Dashboard</h1>;
const EmployeeDashboard = () => <h1>Employee Dashboard</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/security"
          element={
            <ProtectedRoute allowedRoles={["SECURITY"]}>
              <SecurityDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        {/* default */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
