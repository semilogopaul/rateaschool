import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/">School Review App</Link>
        </h1>
        <nav>
          <Link to="/signup" className="px-4 hover:underline">
            Sign Up
          </Link>
          <Link to="/login" className="px-4 hover:underline">
            Log In
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
