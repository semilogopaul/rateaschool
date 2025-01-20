import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <header className="w-full max-w-4xl mx-auto flex justify-between items-center py-4">
        <img src="\rate.svg" alt="RateASchool" className="h-12" />
        <nav>
          <Link
            to="/login"
            className="text-green-600 mr-4 rounded-full border border-green-600 hover:bg-slate-50 px-4 py-2 duration-200"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-white rounded-full bg-green-600 hover:bg-green-700 px-4 py-2 duration-200"
          >
            Register
          </Link>
        </nav>
      </header>
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
        <h2 className="text-5xl font-bold text-center text-black mb-8">
          Welcome to Rate-a-school
        </h2>
        <p className="text-center text-xl text-black mb-8">
          Discover and rate schools. Share your experiences and help others make
          informed decisions.
        </p>
        <Link
          to="/signup"
          className="text-white rounded-full bg-green-600 hover:bg-green-700 px-7 py-2 duration-200"
        >
          Get Started
        </Link>
      </main>
      <footer className="w-full max-w-4xl mx-auto py-4 text-center text-black">
        © 2025 Rate-a-school. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
