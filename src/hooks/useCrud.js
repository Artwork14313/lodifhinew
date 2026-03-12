import { useState, useEffect } from "react";

export default function useCrud(endpoint) {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await fetch(endpoint);
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const createItem = async (item) => {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item)
    });
    fetchData();
  };

  const updateItem = async (item) => {
    await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item)
    });
    fetchData();
  };

  const deleteItem = async (id) => {
    await fetch(endpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    fetchData();
  };

  return { data, createItem, updateItem, deleteItem };
}