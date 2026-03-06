import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaFacebookSquare, FaBars } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { BiSolidChevronDown } from "react-icons/bi";
import { useAuth } from "../AuthContext";
// import Dropdown from "./Dropdown";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [toggleNav, setToggleNav] = useState(false);

  function handleNavToggle() {
    setToggleNav(!toggleNav);
    setDropDownClick(false);
  }

  const [dropDownHover, setDropDownHover] = useState(false);
  const [dropDownHover2, setDropDownHover2] = useState(false);

  function mouseOver() {
    setDropDownHover(true);
  }

  function mouseLeave() {
    setDropDownHover(false);
  }

  function mouseOver2() {
    setDropDownHover2(true);
  }

  function mouseLeave2() {
    setDropDownHover2(false);
  }

  const [dropDownClick, setDropDownClick] = useState(false);

  function handleDropDown() {
    setDropDownClick(!dropDownClick);
  }

  const handleNavLinkClick = (event) => {
    event.preventDefault();
  };

  const { pathname } = useLocation();

  const boxShadow = toggleNav ? "shadow-inner2" : "shadow-md";
  const liDesktop =
    "duration-500 px-3 py-1 border-t-transparent border-t-4 hover:border-t-blue-300 hover:border-t-4 pb-6 text-lg";
  const liMobile =
    "hover:text-[#337CCF] duration-500 hover:bg-blue-50 rounded-r-lg w-full flex flex-start py-1 px-3 border-l-transparent border-l-4 hover:border-l-[#337CCF] hover:border-l-4 text-lg";
  const activeDesktop = "px-3 py-1 border-t-blue-300 border-t-4 pb-6 text-lg";
  const activeMobile =
    "text-[#337CCF] bg-blue-50 rounded-r-lg w-full flex flex-start py-1 px-3 border-l-[#337CCF] border-l-4 text-lg";
  return (
    <>
      <div className="fixed z-10 top-0 flex w-full items-center justify-between lg:justify-around p-4 bg-[#337CCF] text-slate-50 shadow-md h-16 cursor-pointer">
        <span className="text-3xl font-bold duration-500 hover:text-sky-300">
          <a href="/">
            <img
              src="/logo.png"
              alt="hospital logo"
              className="h-6 inline-block mb-1 mr-1"
            ></img>
            LODIFHI
          </a>
        </span>
        <span
          className={`text-lg lg:hidden text-[#337CCF] bg-blue-50 rounded-tl-lg rounded-br-lg p-2 ${boxShadow}`}
        >
          {!toggleNav ? (
            <FaBars onClick={handleNavToggle} />
          ) : (
            <FaX onClick={handleNavToggle} />
          )}
        </span>

        <div className="hidden lg:flex items-center justify-end space-x-4">
          <ul className="flex items-center justify-end space-x-6">
            <li>
              <NavLink
                to={"/"} state={{ source: 'navbar' }}
                className={({ isActive }) =>
                  isActive ? activeDesktop : liDesktop
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/services"
                className={({ isActive }) =>
                  isActive ? activeDesktop : liDesktop
                }
              >
                Services
              </NavLink>
            </li>
            <li className="inline-block relative group">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  dropDownHover || isActive ? activeDesktop : liDesktop
                }
                onClick={handleNavLinkClick}
              >
                About{" "}
                <BiSolidChevronDown className="inline-block relative bottom-[1px] text-lg " />
              </NavLink>
              <div
                onMouseOver={mouseOver}
                onMouseLeave={mouseLeave}
                class="hidden group-hover:block absolute bg-blue-400 w-32 shadow-md z-10 rounded-b-md mt-5"
              >
                <a
                  href="/about"
                  className={pathname === "/about" ? "text-white px-3 py-3 block bg-[#337CCF] duration-500" : "text-white px-3 py-3 block hover:bg-[#337CCF] duration-500"}
                >
                  Hospital
                </a><hr />
                <a href="/about/doctors"
                  className={pathname === "/about/doctors" ? "text-white px-3 py-3 block bg-[#337CCF] duration-500" : "text-white px-3 py-3 block hover:bg-[#337CCF] duration-500"}
                >
                  Doctors
                </a><hr />
                <a
                  href="/about/patientrooms"
                  className={pathname === "/about/patientrooms" ? "text-white px-3 py-3 block bg-[#337CCF] duration-500" : "text-white px-3 py-3 block hover:bg-[#337CCF] duration-500"}
                >
                  Patient Rooms
                </a>
              </div>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? activeDesktop : liDesktop
                }
              >
                Contact
              </NavLink>
            </li>
          </ul>
          <div className="flex items-center justify-end space-x-4">
            <a
              href="https://www.facebook.com/lodifhi.sagay"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-lg duration-500  rounded-b-lg px-3 py-1 border-t-transparent border-t-4 hover:border-t-blue-300 hover:border-t-4 pb-2 pt-2`}
            >
              <FaFacebookSquare />
            </a>
          </div>

          {user ? (
            <li className="inline-block relative group">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  dropDownHover2 || isActive ? activeDesktop : liDesktop
                }
                onClick={handleNavLinkClick}
              >
                Profile{" "}
                <BiSolidChevronDown className="inline-block relative bottom-[1px] text-lg " />
              </NavLink>
              <div
                onMouseOver={mouseOver2}
                onMouseLeave={mouseLeave2}
                class="hidden group-hover:block absolute bg-blue-400 w-32 shadow-md z-10 rounded-b-md mt-5"
              >


                <NavLink
                  to="/profile"
                  className={pathname === "/profile" ? "text-white px-3 py-3 block bg-[#337CCF] duration-500" : "text-white px-3 py-3 block hover:bg-[#337CCF] duration-500"}
                >
                  My Profile
                </NavLink>
                <NavLink
                  to="/profile/admin_pannel"
                  className={pathname === "/profile/admin_pannel" ? "text-white px-3 py-3 block bg-[#337CCF] duration-500" : "text-white px-3 py-3 block hover:bg-[#337CCF] duration-500"}
                >
                  Admin Pannel
                </NavLink>
                <NavLink
                  to="/profile/register"
                  className={pathname === "/profile/register" ? "text-white px-3 py-3 block bg-[#337CCF] duration-500" : "text-white px-3 py-3 block hover:bg-[#337CCF] duration-500"}
                >
                  Register
                </NavLink>
                <hr />
                <button
                  onClick={logout}
                  className="w-full text-left text-white px-3 py-3 hover:bg-[#337CCF] duration-500"
                >
                  Logout
                </button>
              </div>
            </li>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? "text-lg duration-500 px-3 py-1 border-t-4 border-t-blue-300 mt-2 mb-2"
                  : "text-lg duration-500 px-3 py-1 border-t-transparent border-t-4 hover:border-t-blue-300 hover:border-t-4 mt-2 mb-2"
              }
            >
              Login
            </NavLink>
          )}

        </div>
      </div>

      <div
        className={`lg:hidden z-10 fixed top-16 w-full text-white bg-blue-300 cursor-pointer shadow-md p-4 ${!toggleNav && "translate-x-full"
          } transition-all duration-300 delay-100`}
      >
        <ul
          className="flex flex-col z-10 items-start justify-center gap-4"
        >
          <li className="w-full">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? activeMobile : liMobile)} onClick={handleNavToggle}
            >
              Home
            </NavLink>
          </li>
          <li className="w-full">
            <NavLink
              to="/services"
              className={({ isActive }) => (isActive ? activeMobile : liMobile)} onClick={handleNavToggle}
            >
              Services
            </NavLink>
          </li>
          <li className="w-full" onClick={handleDropDown}>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? activeMobile : "duration-500 rounded-r-lg w-full flex flex-start py-1 px-3 border-l-transparent border-l-4   text-lg")}
              onClick={handleNavLinkClick}
            >
              About{" "}
              <BiSolidChevronDown className="inline-block relative top-[6px] left-1 text-lg " />
            </NavLink>
            <div class={` bg-blue-400 w-full z-0 shadow-md rounded-b-md mt-1 ${!dropDownClick && "hidden"}  duration-500`} onClick={handleDropDown}>
              <NavLink
                to="/about"
                className={pathname === "/about" ? "text-white px-10 py-3 bg-[#337CCF] block duration-500" : "text-white hover:bg-[#337CCF] px-10 py-3 block duration-500"} onClick={handleNavToggle}
              >
                Hospital
              </NavLink>
              <hr />
              <NavLink
                to="/about/doctors"
                className={pathname === "/about/doctors" ? "text-white px-10 py-3 bg-[#337CCF] block duration-500" : "text-white hover:bg-[#337CCF] px-10 py-3 block duration-500"} onClick={handleNavToggle}
              >
                Doctors
              </NavLink>
              <hr />
              <NavLink
                to="/about/patientrooms"
                className={pathname === "/about/patientrooms" ? "text-white px-10 py-3 bg-[#337CCF] block duration-500" : "text-white hover:bg-[#337CCF] px-10 py-3 block duration-500"} onClick={handleNavToggle}
              >
                Patient Rooms
              </NavLink>
            </div>
          </li>
          <li className="w-full">
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? activeMobile : liMobile)} onClick={handleNavToggle}
            >
              Contact
            </NavLink>
          </li>
        </ul>
        <div className="flex items-center justify-start space-x-4 mt-4 w-full ">
          <a
            href="https://www.facebook.com/lodifhi.sagay"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-lg ${liMobile}`}
            onClick={handleNavToggle}
          >
            <FaFacebookSquare />
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
