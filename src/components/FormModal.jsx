export default function FormModal({
  title,
  fields,
  formData,
  setFormData,
  onSubmit,
  onClose
}) {
  const handleChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

      <div className="bg-white p-6 rounded w-96 shadow-lg">

        <h2 className="text-lg font-bold mb-4">{title}</h2>

        {fields.map((field) => (
          <div key={field.key} className="mb-3">
            <label className="block text-sm mb-1">{field.label}</label>

            {/* TEXT INPUT */}
            {(!field.type || field.type === "text") && (
              <input
                type="text"
                value={formData[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full border p-2 rounded"
              />
            )}

            {/* SELECT DROPDOWN */}
            {field.type === "select" && (
              <select
                value={formData[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">Select {field.label}</option>

                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {/* FILE UPLOAD */}
            {field.type === "file" && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  id="fileUpload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    setFormData({
                      ...formData,
                      file: file,
                      Source: "/" + file.name
                    });
                  }}
                />

                <label
                  htmlFor="fileUpload"
                  className="cursor-pointer bg-gray-200 px-3 py-2 rounded inline-block"
                >
                  Choose Photo
                </label>

                <span className="ml-3 text-sm text-gray-700">
                  {formData.Source ? formData.Source.replace("/", "") : "No file selected"}
                </span>
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end gap-2 mt-4">

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