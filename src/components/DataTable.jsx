import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function DataTable({ columns, data, onEdit, onDelete }) {
  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          {columns.map((col) => (
            <th key={col.key} className="py-2 px-4 border-b text-left">
              {col.label}
            </th>
          ))}
          <th className="py-2 px-4 border-b text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            {columns.map((col) => (
              <td key={col.key} className="py-2 px-4 border-b">
                {item[col.key]}
              </td>
            ))}

            <td className="py-2 px-4 border-b text-center flex justify-center gap-2">
              <button
                onClick={() => onEdit(item)}
                className="flex items-center bg-blue-500 text-white px-2 py-1 rounded"
              >
                <BiEdit /> 
              </button>

              <button
                onClick={() => onDelete(item.id)}
                className="flex items-center bg-red-500 text-white px-2 py-1 rounded"
              >
                <RiDeleteBin6Line /> 
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}