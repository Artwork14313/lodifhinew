import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../../pages/Home";
import Services from "../../pages/Services";
import About from "../../pages/About";
import Contact from "../../pages/Contact";
import OR from "../../pages/OR";
import Laboratory from "../../pages/Laboratory";
import Pharmacy from "../../pages/Pharmacy";
import Xray from "../../pages/Xray";
import Ultrasound from "../../pages/Ultrasound";
import ER from "../../pages/ER";
import OPD from "../../pages/OPD";
import Doctors from "../../pages/Doctors";
import PatientRooms from "../../pages/PatientRooms";
import LoginForm from "../LoginForm";
import SignUp from "../SignUp";
import Profile from "../../pages/Profile";
import ProtectedRoute from "../ProtectedRoute";
import PublicRoute from "../PublicRoute";
import NotFound from "../../pages/NotFound";
import AdminPannel from "../../pages/AdminPannel";

function NavPage() {
  return (
    <div className="mt-16">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/or" element={<OR />} />
        <Route path="/services/laboratory" element={<Laboratory />} />
        <Route path="/services/pharmacy" element={<Pharmacy />} />
        <Route path="/services/xray" element={<Xray />} />
        <Route path="/services/ultrasound" element={<Ultrasound />} />
        <Route path="/services/er" element={<ER />} />
        <Route path="/services/outpatient" element={<OPD />} />
        <Route path="/about" element={<About />} />
        <Route path="/about/doctors" element={<Doctors />} />
        <Route path="/about/patientrooms" element={<PatientRooms />} />
        <Route path="/contact" element={<Contact />} />

        {/* Public routes */}
        <Route path="/login" element={<PublicRoute element={LoginForm} />} />


        {/* Protected routes */}
        <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
        <Route path="/profile/adminPannel" element={<ProtectedRoute element={AdminPannel} />} />
        <Route path="/profile/register" element={<ProtectedRoute element={SignUp} />} />

        {/* Catch-all 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default NavPage;
