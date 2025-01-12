import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LandingPage from "./pages/LandingPage";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import SchoolDetails from "./pages/SchoolDetails";
import UserProfile from "./pages/UserProfile";

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Define routes here */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/schools/:id" element={<SchoolDetails />} />
          <Route path="/users/profile" element={<UserProfile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
