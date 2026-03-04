import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL_REGISTER;

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleRegister = async (e) => {
  e.preventDefault();
  setError("");

  if (!API_URL) {
    return setError("API URL not configured.");
  }

  // Trim input fields
  const email = formData.email.trim();
  const firstName = formData.firstName.trim();
  const lastName = formData.lastName.trim();
  const password = formData.password;

  if (!firstName || !lastName || !email || !password) {
    return setError("All fields are required.");
  }

  if (password.length < 6) {
    return setError("Password must be at least 6 characters.");
  }

  try {
    setLoading(true);

    const payload = {
      firstName,
      lastName,
      email,
      password,
    };

    const response = await axios.post(API_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.data.success) {
      navigate("/profile");
    } else {
      setError(response.data.error || "Registration failed.");
    }

  } catch (err) {
    console.error("REGISTER ERROR:", err.response || err);
    setError(
      err.response?.data?.error || "Registration failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8"
          onSubmit={handleRegister}
        >
          <div className="flex gap-2">
            <div className="w-1/2">
              <input
                required
                className="border border-gray-300 w-full p-2"
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="w-1/2">
              <input
                required
                className="border border-gray-300 w-full p-2"
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-4">
            <input
              required
              className="border border-gray-300 w-full p-2"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mt-4">
            <input
              required
              className="border border-gray-300 w-full p-2"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-3">{error}</p>
          )}

          <div className="mt-6">
            <button
              disabled={loading}
              className="bg-[#337CCF] hover:bg-blue-700 text-white w-full font-bold py-2 px-4 rounded disabled:opacity-50"
              type="submit"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
