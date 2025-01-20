import React from "react";
import Signup from "../components/auth/Signup";
import screenshot from "../assets/Screenshot_2025-01-18_210446-transformed.png";

const SignupPage: React.FC = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      style={{
        backgroundImage: `url(${screenshot})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
      }}
    >
      <Signup />
    </div>
  );
};

export default SignupPage;
