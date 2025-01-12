import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

interface School {
  id: number;
  name: string;
  description: string;
  location: string;
  image: string;
}

const Dashboard: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [locationTerm, setLocationTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>("");

  const fetchSchools = async () => {
    try {
      const response = await api.get(
        `/schools/?search=${searchTerm}&location=${locationTerm}`
      );
      setSchools(response.data);
    } catch (err: any) {
      setError("Failed to fetch schools");
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/users/profile/");
      setUsername(response.data.username); // Assuming 'username' is available in the user profile response
    } catch (err: any) {
      setError("Failed to fetch user data");
    }
  };

  useEffect(() => {
    fetchSchools();
    fetchUserProfile();
  }, [searchTerm, locationTerm]);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Welcome, {username}🤗</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by school name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Search by location"
          value={locationTerm}
          onChange={(e) => setLocationTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schools.map((school) => (
          <Link key={school.id} to={`/schools/${school.id}`}>
            <div className="border p-4 rounded shadow hover:shadow-lg transition">
              <img
                src={school.image}
                alt={school.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h3 className="text-xl font-bold">{school.name}</h3>
              <p className="text-sm mt-2">{school.description}</p>
              <p className="text-sm mt-1 text-gray-500">{school.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
