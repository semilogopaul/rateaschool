import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="w-full px-4 flex justify-between items-center py-4">
      <Link to="/dashboard">
        <img src="\rate.svg" alt="RateASchool" className="h-12" />
      </Link>
      <nav>
        <Link
          to="/logout"
          className="text-green-600 mr-4 rounded-full border border-green-600 duration-200 hover:bg-slate-50 px-4 py-2 duration-200"
        >
          Logout
        </Link>
        <Link
          to="/users/profile"
          className="text-white rounded-full bg-green-600 duration-200 hover:bg-green-700 px-4 py-2 duration-200"
        >
          Profile
        </Link>
      </nav>
    </header>
  );
};

export default Header;
