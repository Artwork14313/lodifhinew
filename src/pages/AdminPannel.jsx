import { useState } from "react";
import useCrud from "../hooks/useCrud";
import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import { FaFolderPlus } from "react-icons/fa6";
import Swal from "sweetalert2";

function AdminPanel() {

  const [activeTab, setActiveTab] = useState("contacts");

  const endpoints = {
    contacts: "http://localhost/lodifhinew-main/api/contacts.php",
    doctors: "http://localhost/lodifhinew-main/api/doctors.php",
    rooms: "http://localhost/lodifhinew-main/api/rooms.php"
  };

  const { data, createItem, updateItem, deleteItem } =
    useCrud(endpoints[activeTab]);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);

  const configs = {
    contacts: {
      columns: [
        { key: "department", label: "Department" },
        { key: "contactNum", label: "Contact Number" }
      ],
      fields: [
        { key: "department", label: "Department" },
        { key: "contactNum", label: "Contact Number" }
      ]
    },

    doctors: {
      columns: [
        { key: "fullName", label: "Name" },
        { key: "specialization", label: "Specialization" }
      ],
      fields: [
        { key: "fullName", label: "Name", type: "text" },
        {
          key: "specialization",
          label: "Specialization",
          type: "select",
          options: [
            "Cardiologist",
            "Pediatrics",
            "Dermatologist",
            "Orthopedic",
            "Neurologist",
            "General Practitioner"
          ]
        },
        {
          key: "Source",
          label: "Doctor Photo",
          type: "file"
        }
      ]
    },

    rooms: {
      columns: [
        { key: "room_name", label: "Room" },
        { key: "capacity", label: "Capacity" }
      ],
      fields: [
        { key: "room_name", label: "Room" },
        { key: "capacity", label: "Capacity" }
      ]
    }
  };

  const labels = {
    contacts: "Contact",
    doctors: "Doctor",
    rooms: "Room",
    services: "Service",
    leaders: "Leader"
  };

  const config = configs[activeTab];

  // 🔹 Prevent empty fields
  const validateForm = () => {
    if (!config) return false;

    for (let field of config.fields) {
      const value = formData[field.key];

      if (!value || value.toString().trim() === "") {
        Swal.fire({
          icon: "warning",
          title: "Missing Field",
          text: `${field.label} cannot be empty`,
          customClass: {
            confirmButton:
              "bg-[#337CCF] text-white px-5 py-2 rounded hover:bg-blue-600",
          },
        });

        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {

    if (!validateForm()) return;

    if (editing) {
      await updateItem(formData);
    } else {
      await createItem(formData);
    }

    setModalOpen(false);
    setFormData({});
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-[#355872] text-white p-5">
        <h2 className="text-xl font-bold mb-5">Admin Panel</h2>

        <ul className="space-y-3">

          <li
            onClick={() => setActiveTab("contacts")}
            className={`cursor-pointer p-2 rounded ${activeTab === "contacts" ? "bg-white text-[#355872]" : ""}`}
          >
            Contact Info
          </li>

          <li
            onClick={() => setActiveTab("doctors")}
            className={`cursor-pointer p-2 rounded ${activeTab === "doctors" ? "bg-white text-[#355872]" : ""}`}
          >
            Doctors Info
          </li>

          <li
            onClick={() => setActiveTab("leaders")}
            className={`cursor-pointer p-2 rounded ${activeTab === "leaders" ? "bg-white text-[#355872]" : ""}`}
          >
            Leaders Info
          </li>

          <li
            onClick={() => setActiveTab("rooms")}
            className={`cursor-pointer p-2 rounded ${activeTab === "rooms" ? "bg-white text-[#355872]" : ""}`}
          >
            Room Info
          </li>

          <li
            onClick={() => setActiveTab("services")}
            className={`cursor-pointer p-2 rounded ${activeTab === "services" ? "bg-white text-[#355872]" : ""}`}
          >
            Services Info
          </li>

        </ul>
      </div>

      {/* Content */}
      <div className="p-10 flex-1">

        {config ? (
          <>
            <DataTable
              columns={config.columns}
              data={data}
              onEdit={(item) => {
                setEditing(true);
                setFormData(item);
                setModalOpen(true);
              }}
              onDelete={deleteItem}
            />

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData({});
                  setModalOpen(true);
                }}
                className="flex items-center gap-2 mt-4 bg-green-500 text-white px-4 py-2 rounded"
              >
                <FaFolderPlus /> Add New
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-lg">
            Module not configured yet.
          </div>
        )}

        {modalOpen && config && (
          <FormModal
            title={`${editing ? "Edit" : "Add"} ${labels[activeTab]}`}
            fields={config.fields}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onClose={() => setModalOpen(false)}
          />
        )}

      </div>
    </div>
  );
}

export default AdminPanel;