export default function FormModal({
  title,
  fields,
  formData,
  setFormData,
  onSubmit,
  onClose
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

      <div className="bg-white p-6 rounded w-96 shadow-lg">

        <h2 className="text-lg font-bold mb-4">{title}</h2>

        {fields.map((field) => (
          <div key={field.key} className="mb-3">
            <label className="block text-sm">{field.label}</label>

            <input
              type="text"
              value={formData[field.key] || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [field.key]: e.target.value
                })
              }
              className="w-full border p-2 rounded"
            />
          </div>
        ))}

        <div className="flex justify-end gap-2">
          <button
            onClick={onSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>

          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>

      </div>

    </div>
  );
}