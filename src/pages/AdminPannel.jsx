import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { PiPaperPlaneTiltFill } from "react-icons/pi";
import { ImCancelCircle } from "react-icons/im";
import { FaFolderPlus } from "react-icons/fa6";
import Swal from "sweetalert2";

function AdminPannel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("contact");
  const [contacts, setContacts] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    department: "",
    contactNum: ""
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    department: "",
    contactNum: ""
  });

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === "contact") {
      fetchContacts();
    } else if (activeTab === "doctors") {
      fetchDoctors();
    }
  }, [activeTab]);

  const fetchContacts = async () => {
    try {
      const res = await fetch(
        "http://localhost/lodifhinew-main/api/contacts.php"
      );
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch(
        "http://localhost/lodifhinew-main/api/doctors.php"
      );
      const data = await res.json();
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleDelete = async (id) => {

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This contact will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-red-600 text-white px-5 py-2 rounded mr-2 hover:bg-red-700",
        cancelButton:
          "bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500",
      }
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(
        "http://localhost/lodifhinew-main/api/contacts.php",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        fetchContacts();

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Contact has been deleted.",
          confirmButtonText: "OK",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-[#337CCF] text-white px-5 py-2 rounded hover:bg-blue-600",
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: data?.error || "Something went wrong."
        });
      }

    } catch (error) {
      console.error("Delete failed:", error);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to delete contact."
      });
    }
  };

  const handleEdit = (contact) => {
    setEditData({
      id: contact.id,
      department: contact.department,
      contactNum: contact.contactNum
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {

    // Validation
    const fields = [
      { key: "contactNum", label: "Contact Number" },
      { key: "department", label: "Department" }
    ];

    for (let field of fields) {
      if (!editData[field.key] || editData[field.key].trim() === "") {

        document.activeElement.blur(); // prevent aria-hidden warning

        Swal.fire({
          icon: "warning",
          title: "Missing Field",
          text: `${field.label} cannot be empty.`,
          confirmButtonText: "OK",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-[#337CCF] text-white px-5 py-2 rounded hover:bg-blue-600",
          },
        });

        return; // stop update
      }
    }

    try {
      const res = await fetch(
        "http://localhost/lodifhinew-main/api/contacts.php",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setIsModalOpen(false);
        fetchContacts();

        Swal.fire({
          icon: "success",
          title: "Updated Successfully",
          text: "Contact information has been updated.",
          confirmButtonText: "OK",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-[#337CCF] text-white px-5 py-2 rounded hover:bg-blue-600",
          },
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: data?.error || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error("Update failed:", error);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to update contact. Please try again.",
      });
    }
  };

  const handleAdd = async () => {
    const fields = [
      { key: "contactNum", label: "Contact Number" },
      { key: "department", label: "Department" }
    ];

    for (let field of fields) {
      if (!newContact[field.key] || !newContact[field.key].trim() === "") {

        document.activeElement.blur(); // prevent aria-hidden warning

        Swal.fire({
          icon: "warning",
          title: "Missing Field",
          text: `${field.label} cannot be empty.`,
          confirmButtonText: "OK",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-[#337CCF] text-white px-5 py-2 rounded hover:bg-blue-600",
          },
        });

        return; // stop update
      }
    }

    try {
      const res = await fetch("http://localhost/lodifhinew-main/api/contacts.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newContact)
      });
      const data = await res.json();

      if (res.ok) {
        setIsAddModalOpen(false);
        setNewContact({ department: "", contactNum: "" });
        fetchContacts(); // refresh table

        Swal.fire({
          icon: "success",
          title: "Added Successfully",
          text: "Contact information has been added.",
          confirmButtonText: "OK",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-[#337CCF] text-white px-5 py-2 rounded hover:bg-blue-600",
          },
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: data?.error || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error("Add failed:", error);
    }
  };

  const formatNumber = (num) => {
    if (num.length < 11) {
      return `${num.slice(0, 3)} ${num.slice(3, 6)} ${num.slice(6, 10)}`;
    }
    return `${num.slice(0, 4)} ${num.slice(4, 7)} ${num.slice(7, 11)}`;
  };

  if (!user) return null;

  const renderContactTable = () => {
    return (
      <div>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Department</th>
              <th className="py-2 px-4 border-b text-left">Contact Number</th>
              <th className="py-2 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4 border-b">{item.department}</td>
                <td className="py-2 px-4 border-b">{formatNumber(item.contactNum)}</td>
                <td className="py-2 px-4 border-b text-center space-x-2 flex flex-row justify-center">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex items-center bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    <BiEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    <RiDeleteBin6Line /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="my-2 flex justify-end"><button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-green-500 text-white px-2 py-2 rounded hover:bg-green-700"
        >
          <FaFolderPlus /> New
        </button></div>
      </div>
    );
  };

  const renderDoctorsTable = () => {
    return (
      <div>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Specialization</th>
              <th className="py-2 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4 border-b">{item.fullname}</td>
                <td className="py-2 px-4 border-b">{item.specialization}</td>
                <td className="py-2 px-4 border-b text-center space-x-2 flex flex-row justify-center">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex items-center bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    <BiEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    <RiDeleteBin6Line /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="my-2 flex justify-end"><button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-green-500 text-white px-2 py-2 rounded hover:bg-green-700"
        >
          <FaFolderPlus /> New
        </button></div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#355872] text-white p-5">
        <h2 className="text-xl font-bold mb-5">Admin Panel</h2>

        <ul className="space-y-3">
          <li
            onClick={() => setActiveTab("contact")}
            className={`cursor-pointer p-2 rounded ${activeTab === "contact" ? "bg-white text-[#355872]" : ""
              }`}
          >
            Contact Info
          </li>

          <li
            onClick={() => setActiveTab("doctors")}
            className={`cursor-pointer p-2 rounded ${activeTab === "doctors" ? "bg-white text-[#355872]" : ""
              }`}
          >
            Doctors Info
          </li>

          <li
            onClick={() => setActiveTab("leaders")}
            className="cursor-pointer p-2 rounded"
          >
            Leaders Info
          </li>

          <li
            onClick={() => setActiveTab("rooms")}
            className="cursor-pointer p-2 rounded"
          >
            Room Info
          </li>

          <li
            onClick={() => setActiveTab("services")}
            className="cursor-pointer p-2 rounded"
          >
            Services Info
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="flex-1 p-10">
        {activeTab === "contact" && renderContactTable()}
        {activeTab === "doctors" && renderDoctorsTable()}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Edit Contact</h2>

            <div className="mb-3">
              <label className="block text-sm">Department</label>
              <input
                type="text"
                value={editData.department}
                onChange={(e) =>
                  setEditData({ ...editData, department: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm">Contact Number</label>
              <input
                type="text"
                value={editData.contactNum}
                onChange={(e) =>
                  setEditData({ ...editData, contactNum: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="flex justify-end space-x-2">


              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-400"
              >
                Submit
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-700 text-white px-5 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Add Contact</h2>

            <div className="mb-3">
              <label className="block text-sm">Department</label>
              <input
                type="text"
                value={newContact.department}
                onChange={(e) =>
                  setNewContact({ ...newContact, department: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm">Contact Number</label>
              <input
                type="text"
                value={newContact.contactNum}
                onChange={(e) =>
                  setNewContact({ ...newContact, contactNum: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleAdd}
                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-400"
              >
                Submit
              </button>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="bg-gray-700 text-white px-5 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPannel;