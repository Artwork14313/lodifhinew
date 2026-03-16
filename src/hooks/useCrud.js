import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function useCrud(endpoint) {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch(endpoint);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Fetch error:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch data."
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  // ========================
  // Send request helper
  // ========================
  const sendRequest = async (method, item) => {
    const isDoctors = endpoint.includes("doctors");
    let fetchOptions;

    if (isDoctors) {
      // 🔹 Use FormData for doctors (file + fields)
      const formData = new FormData();
      Object.keys(item).forEach(key => {
        if (item[key] !== undefined && item[key] !== null) {
          formData.append(key, item[key]);
        }
      });

      // 🔹 For PUT, use POST + _method=PUT
      const url = method === "PUT" ? `${endpoint}?_method=PUT` : endpoint;

      fetchOptions = {
        method: "POST",
        body: formData
      };

      return fetch(url, fetchOptions);
    } else {
      // 🔹 Use JSON for other entities
      fetchOptions = {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      };
      return fetch(endpoint, fetchOptions);
    }
  };

  // ========================
  // Create Item
  // ========================
  const createItem = async (item) => {
    const res = await sendRequest("POST", item);
    const result = await res.json();

    if (!res.ok) {
      Swal.fire({
        icon: "error",
        title: "Create Failed",
        text: result.error || "Unable to add record."
      });
      return false;
    }

    await fetchData();

    Swal.fire({
      icon: "success",
      title: "Success",
      text: result.message || "Record added successfully.",
      customClass: {
        confirmButton:
          "bg-[#337CCF] text-white px-5 py-2 rounded hover:bg-blue-600"
      }
    });

    return true;
  };

  // ========================
  // Update Item
  // ========================
  const updateItem = async (item) => {
    const res = await sendRequest("PUT", item);
    const result = await res.json();

    if (!res.ok) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: result.error || "Unable to update record."
      });
      return false;
    }

    await fetchData();

    Swal.fire({
      icon: "success",
      title: "Success",
      text: result.message || "Record updated successfully.",
      customClass: {
        confirmButton:
          "bg-[#337CCF] text-white px-5 py-2 rounded hover:bg-blue-600"
      }
    });

    return true;
  };

  // ========================
  // Delete Item
  // ========================
  const deleteItem = async (id) => {
    try {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "This record will be deleted.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it",
        customClass: {
          confirmButton:
            "bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600",
          cancelButton:
            "bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600"
        }
      });

      if (!confirm.isConfirmed) return false;

      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: "Unable to delete record."
        });
        return false;
      }

      await fetchData();

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Record deleted successfully.",
        customClass: {
          confirmButton:
            "bg-[#337CCF] text-white px-5 py-2 rounded hover:bg-blue-600",
        }
      });

      return true;

    } catch (err) {
      console.error("Delete error:", err);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to connect to server."
      });

      return false;
    }
  };

  return { data, createItem, updateItem, deleteItem };
}