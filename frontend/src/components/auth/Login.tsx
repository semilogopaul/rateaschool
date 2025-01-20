import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/login/", formData);
      const access_token = response.data.access;
      const refresh_token = response.data.refresh;

      // Save tokens to localStorage
      localStorage.setItem("access", access_token);
      localStorage.setItem("refresh", refresh_token);

      navigate("/dashboard"); // Redirect to Dashboard
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="max-w-xl w-80 mx-auto mt-10 p-6  shadow-md rounded-lg bg-white">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded duration-200 hover:bg-green-700"
        >
          Login
        </button>
      </form>
      <div className="mt-4 flex justify-between items-center">
        <Link to="/signup" className="text-green-500 text-sm">
          Don't have an account? Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
