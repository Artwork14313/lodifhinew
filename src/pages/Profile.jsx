import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Swal from "sweetalert2";

function Profile() {
  const { user } = useAuth(); // user.id will be used
  const navigate = useNavigate();

  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const oldPasswordRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    oldPassword: ""
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Load current user info
  useEffect(() => {
    if (user) {
      fetch(`http://localhost/lodifhinew-main/api/user.php?id=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            fullName: data?.fullName || "",
            email: data?.email || "",
            password: ""
          });
        });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {

    const fields = [
      { key: "fullName", ref: fullNameRef, label: "Full Name" },
      { key: "email", ref: emailRef, label: "Email" },
      { key: "oldPassword", ref: oldPasswordRef, label: "Old Password" }
    ];

    for (let field of fields) {
      if (!formData[field.key]) {

        // remove focus from input first
        document.activeElement.blur();

        Swal.fire({
          icon: "warning",
          title: "Missing Field",
          text: `${field.label} is required`,
          confirmButtonText: "OK",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-[#337CCF] text-white px-5 py-2 rounded hover:bg-blue-600"
          }
        }).then(() => {
          field.ref.current?.focus();
        });

        return;
      }
    }

    try {
      const res = await fetch("http://localhost/lodifhinew-main/api/user.php", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: user.id,
          ...formData
        })
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Saved!",
          text: "Profile updated successfully",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-[#337CCF] text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
          }
        });

        setFormData({
          ...formData,
          password: "",
          oldPassword: ""
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Error",
          text: data.message || "Profile update failed",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-[#337CCF] text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
          }
        });
      }

    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Profile Details</h2>

        <div className="mb-3">
          <label className="block text-sm">Full Name</label>
          <input
            ref={fullNameRef}
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm">Email</label>
          <input
            ref={emailRef}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm">Old Password</label>
          <input
            ref={oldPasswordRef}
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm">
            New Password (leave blank if no change)
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          onClick={handleUpdate}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}

export default Profile;