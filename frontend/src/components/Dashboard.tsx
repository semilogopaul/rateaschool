import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

interface School {
  id: number;
  name: string;
  description: string;
  location: string;
  image: string;
  average_rating: number;
}

const Dashboard: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>("");

  const fetchSchools = async () => {
    try {
      const response = await api.get(`/schools/?search=${searchTerm}`);
      setSchools(response.data);
    } catch (err: any) {
      setError("Failed to fetch schools");
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/users/profile/");
      setUsername(response.data.username);
    } catch (err: any) {
      setError("Failed to fetch user data");
    }
  };

  useEffect(() => {
    fetchSchools();
    fetchUserProfile();
  }, [searchTerm]);

  return (
    <div className="p-6 bg-white rounded-lg">
      <h2 className="text-6xl font-bold mb-6">
        <span className="bg-gradient-to-r from-green-600 to-green-400 text-transparent bg-clip-text">
          Welcome,{" "}
          {username && username.charAt(0).toUpperCase() + username.slice(1)}
        </span>
        🤗
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by school name or location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 text-lg border rounded-full shadow focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schools.map((school) => (
          <Link key={school.id} to={`/schools/${school.id}`}>
            <div className="flex flex-col border p-4 rounded shadow hover:shadow-lg transition duration-500 h-full">
              <img
                src={school.image}
                alt={school.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <div className="flex-grow">
                <h3 className="text-xl font-bold">{school.name}</h3>
                <p className="text-sm mt-2 line-clamp-3">
                  {school.description}
                </p>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {school.location.toUpperCase()}
              </div>
              <div className="mt-2 text-2xl">
                {school.average_rating}
                <span className="text-yellow-400"> ★</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
