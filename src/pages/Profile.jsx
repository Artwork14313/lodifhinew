import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <>
      <div>This is your Profile</div>
      <div>Welcome {user}</div>
    </>
  );
}

export default Profile;
