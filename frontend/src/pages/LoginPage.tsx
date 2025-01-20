import React from "react";
import Login from "../components/auth/Login";
import screenshot from "../assets/Screenshot_2025-01-18_210446-transformed.png";

const LoginPage: React.FC = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${screenshot})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
      }}
    >
      <Login />
    </div>
  );
};

export default LoginPage;
