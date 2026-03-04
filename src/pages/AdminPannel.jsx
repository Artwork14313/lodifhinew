import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { PiPaperPlaneTiltFill } from "react-icons/pi";
import { ImCancelCircle } from "react-icons/im";
import { FaFolderPlus } from "react-icons/fa6";

function AdminPannel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("contact");
  const [contacts, setContacts] = useState([]);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?"))
      return;

    try {
      await fetch(
        "http://localhost/lodifhinew-main/api/contacts.php",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );

      fetchContacts(); // refresh after delete
    } catch (error) {
      console.error("Delete failed:", error);
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
    try {
      await fetch("http://localhost/lodifhinew-main/api/contacts.php", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      setIsModalOpen(false);
      fetchContacts(); // refresh table
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleAdd = async () => {
    if (!newContact.department || !newContact.contactNum) {
      alert("Please fill all fields");
      return;
    }

    try {
      await fetch("http://localhost/lodifhinew-main/api/contacts.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newContact)
      });

      setIsAddModalOpen(false);
      setNewContact({ department: "", contactNum: "" });
      fetchContacts(); // refresh table
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
                <td className="py-2 px-4 border-b text-center space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-700"
                  >
                    <BiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-2 py-2 rounded hover:bg-red-700"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="my-2"><button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-500 text-white px-2 py-2 rounded hover:bg-green-700"
        >
          <FaFolderPlus />
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
            className="cursor-pointer p-2 rounded"
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
        {activeTab !== "contact" && (
          <div className="text-gray-500">
            {activeTab} section coming soon...
          </div>
        )}
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
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-500"
              >
                <ImCancelCircle />
              </button>

              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-400"
              >
                <PiPaperPlaneTiltFill />
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
                onClick={() => setIsAddModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAdd}
                className="bg-green-600 text-white px-4 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPannel;