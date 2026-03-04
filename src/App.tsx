import { Route, Routes } from "react-router";
import Auth from "./Pages/Authentication/Auth";
import Layout from "./shares/Layout/Layout";
import Home from "./Pages/Home/Home";
import AdminDashboardLayout from "./Pages/Dahboard/Admin/AdminDashboardLayout";
import UserDashboardLayout from "./Pages/Dahboard/User/UserDashboardLayout";
import RequestsManagement from "./Pages/Dahboard/Admin/Component/RequestsManagement";
import CategoriesManagement from "./Pages/Dahboard/Admin/Component/CategoriesManagement";
import AbuseReportsManagement from "./Pages/Dahboard/Admin/Component/AbuseReportsManagement";
import UsersManagement from "./Pages/Dahboard/Admin/Component/UsersManagement";
import AdminDashboardHome from "./Pages/Dahboard/Admin/Component/AdminDashboardHome";
import AdminSettings from "./Pages/Dahboard/Admin/Component/AdminSettings";
import BrowserRequest from "./Pages/Dahboard/User/Components/BrowserRequest";
import Messages from "./Pages/Dahboard/User/Components/Messages";
import UserDashboardHome from "./Pages/Dahboard/User/Components/UserDashboardHome";
import Settings from "./Pages/Dahboard/User/Components/Settings";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./shares/Components.tsx/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboardLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboardHome />} />
        <Route path="requests" element={<RequestsManagement />} />
        <Route path="categories" element={<CategoriesManagement />} />
        <Route path="abuse-reports" element={<AbuseReportsManagement />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="messages" element={<Messages />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="/dashboard" element={<ProtectedRoute><UserDashboardLayout /></ProtectedRoute>}>
        <Route index element={<UserDashboardHome />} />
        <Route path="messages" element={<Messages />} />
        <Route path="browse" element={<BrowserRequest />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
    </AuthProvider>
  );
};

export default App;
