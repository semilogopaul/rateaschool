import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear tokens from localStorage
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    // Redirect to the login page
    navigate("/login");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold">Logging you out...</h2>
    </div>
  );
};

export default LogoutPage;
