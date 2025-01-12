import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

interface School {
  id: number;
  name: string;
  description: string;
  location: string;
  image: string;
  details: string; // Any additional details you might want to show
}

const SchoolDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [school, setSchool] = useState<School | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchoolDetails = async () => {
      try {
        const response = await api.get(`/schools/${id}`);
        setSchool(response.data);
      } catch (err: any) {
        setError("Failed to fetch school details");
      }
    };

    fetchSchoolDetails();
  }, [id]);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {school && (
        <div>
          <img
            src={school.image}
            alt={school.name}
            className="w-full h-64 object-cover rounded mb-4"
          />
          <h2 className="text-3xl font-bold mb-2">{school.name}</h2>
          <p className="text-gray-600 mb-2">{school.description}</p>
          <p className="text-sm text-gray-500">{school.location}</p>
          <p className="mt-4">{school.details}</p>
        </div>
      )}
    </div>
  );
};

export default SchoolDetails;
