import { Routes, Route, Navigate } from "react-router-dom";
import AuthenticatedLayout from "./components/layouts/authenticated-layout";
// Auth Pages
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
// Main Pages
import DashboardPage from "./pages/dashboard";
import ProfilePage from "./pages/profile";
import BranchPage from "./pages/branch";
import RolePage from "./pages/role";
import EmployeePage from "./pages/employee";
// Delivery & Shipping Pages
import DeliveryPage from "./pages/delivery";
import SendPackagePage from "./pages/send-package";
import AddSendPackagePage from "./pages/send-package/add";
import DetailSendPackagePage from "./pages/send-package/detail";
import PaySendPackagePage from "./pages/send-package/pay";
// History & Tracking Pages
import HistoryPage from "./pages/history";
import DetailHistoryPage from "./pages/history/detail";
import TrackPackagePage from "./pages/track-package";
import ShipmentBranchPage from "./pages/shipment-branch";
// User Address Pages
import UserAddressesPage from "./pages/user-addresses";
import AddUserAddressPage from "./pages/user-addresses/add";
import EditUserAddressPage from "./pages/user-addresses/edit";
import NoAddressPage from "./pages/send-package/no-address";
// Auth Guard
import { AuthGuard } from "./components/auth-guard";

function App() {
  return (
    <Routes>
      {/* Redirect to login by default */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

      {/* Auth Routes */}
      <Route
        path="/auth/login"
        element={
          <AuthGuard requiredAuth={false}>
            <LoginPage />
          </AuthGuard>
        }
      />
      <Route
        path="/auth/register"
        element={
          <AuthGuard requiredAuth={false}>
            <RegisterPage />
          </AuthGuard>
        }
      />

      {/* Protected Routes */}
      <Route
        element={
          <AuthGuard requiredAuth={true}>
            <AuthenticatedLayout />
          </AuthGuard>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/profile" element={<ProfilePage />} />

        {/* Branch Management */}
        <Route
          path="/branch"
          element={
            <AuthGuard requiredAuth={true} role="super_admin">
              <BranchPage />
            </AuthGuard>
          }
        />

        {/* Role Management */}
        <Route
          path="/role"
          element={
            <AuthGuard requiredAuth={true} role="super_admin">
              <RolePage />
            </AuthGuard>
          }
        />

        {/* Employee Management */}
        <Route
          path="/employee"
          element={
            <AuthGuard
              requiredAuth={true}
              roles={["super_admin", "admin_branch"]}
            >
              <EmployeePage />
            </AuthGuard>
          }
        />

        {/* User Address Management */}
        <Route path="/user-addresses" element={<UserAddressesPage />} />
        <Route path="/user-addresses/add" element={<AddUserAddressPage />} />
        <Route
          path="/user-addresses/edit/:id"
          element={<EditUserAddressPage />}
        />

        {/* Delivery Management */}
        <Route
          path="/delivery"
          element={
            <AuthGuard
              requiredAuth={true}
              roles={["super_admin", "admin_branch", "courier"]}
            >
              <DeliveryPage />
            </AuthGuard>
          }
        />

        {/* Package Sending */}
        <Route
          path="/send-package"
          element={
            <AuthGuard requiredAuth={true} role="customer">
              <SendPackagePage />
            </AuthGuard>
          }
        />
        <Route
          path="/send-package/no-address"
          element={
            <AuthGuard requiredAuth={true} role="customer">
              <NoAddressPage />
            </AuthGuard>
          }
        />
        <Route
          path="/send-package/add"
          element={
            <AuthGuard requiredAuth={true} role="customer">
              <AddSendPackagePage />
            </AuthGuard>
          }
        />
        <Route
          path="/send-package/detail/:id"
          element={
            <AuthGuard requiredAuth={true} role="customer">
              <DetailSendPackagePage />
            </AuthGuard>
          }
        />
        <Route
          path="/send-package/pay/:id"
          element={
            <AuthGuard requiredAuth={true} role="customer">
              <PaySendPackagePage />
            </AuthGuard>
          }
        />

        {/* History */}
        <Route
          path="/history"
          element={
            <AuthGuard requiredAuth={true} role="customer">
              <HistoryPage />
            </AuthGuard>
          }
        />
        <Route
          path="/history/detail/:id"
          element={
            <AuthGuard requiredAuth={true} role="customer">
              <DetailHistoryPage />
            </AuthGuard>
          }
        />

        {/* Package Tracking */}
        <Route
          path="/track-package"
          element={
            <AuthGuard requiredAuth={true} role="customer">
              <TrackPackagePage />
            </AuthGuard>
          }
        />

        {/* Shipment Branch */}
        <Route
          path="/shipment-branch"
          element={
            <AuthGuard
              requiredAuth={true}
              roles={["admin_branch", "super_admin"]}
            >
              <ShipmentBranchPage />
            </AuthGuard>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
