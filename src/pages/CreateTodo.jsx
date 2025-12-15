import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Image as ImageIcon } from "lucide-react";
import api from "../services/api";

export default function CreateTodo() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please select an image file" }));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size should be less than 5MB",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
    setPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const removeImage = () => {
    setPreview(null);
    setFormData((prev) => ({ ...prev, image: null }));
    document.getElementById("image-upload").value = "";
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.image) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const reader = new FileReader();

      reader.onloadend = async () => {
        try {
          await api.post({
            id: Date.now(),
            title: formData.title,
            description: formData.description,
            status: formData.status,
            image: reader.result,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          navigate("/todos");
        } catch (error) {
          console.error("Error creating todo:", error);
          setErrors((prev) => ({
            ...prev,
            submit: "Failed to create todo. Please try again.",
          }));
        }
      };

      reader.readAsDataURL(formData.image);
    } catch (error) {
      console.error("Error processing image:", error);
      setErrors((prev) => ({
        ...prev,
        image: "Failed to process image. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/todos")}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Create New Todo
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-medium">
                {errors.submit}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="What needs to be done?"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.title ? "border-red-300" : "border-gray-300"
                } focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors`}
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Add details, notes, or instructions..."
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none resize-none transition-colors"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors appearance-none bg-white"
                disabled={isSubmitting}
              >
                <option value="pending" className="py-2">
                  Pending
                </option>
                <option value="completed" className="py-2">
                  Completed
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image <span className="text-red-500">*</span>
              </label>
              {!preview ? (
                <div
                  className={`relative border-2 ${
                    errors.image
                      ? "border-red-300"
                      : "border-dashed border-gray-300"
                  } rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors`}
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isSubmitting}
                  />
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 font-medium mb-2">
                    Click to upload an image
                  </p>
                  <p className="text-gray-500 text-sm">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative group">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-2xl shadow-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="px-4 py-2 bg-white text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("image-upload").click()
                    }
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    disabled={isSubmitting}
                  >
                    Upload different image
                  </button>
                </div>
              )}

              {errors.image && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <ImageIcon className="w-4 h-4 mr-1" />
                  {errors.image}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                isSubmitting
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Creating...
                </div>
              ) : (
                "Create Todo"
              )}
            </button>

            <p className="text-center text-gray-500 text-sm">
              All fields marked with <span className="text-red-500">*</span> are
              required
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
