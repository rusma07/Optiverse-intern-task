import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Loader2,
} from "lucide-react";
import api from "../services/api";

export default function EditTodo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [todo, setTodo] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    image: null, 
  });

  const [preview, setPreview] = useState(null); 
  const [imageChanged, setImageChanged] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchTodo();
  }, [id]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const fetchTodo = async () => {
    setLoading(true);
    try {
      const res = await api.get();
      const found = res.data?.find((t) => t.id === Number(id));

      if (!found) {
        navigate("/todos");
        return;
      }

      setTodo(found);
      setFormData({
        title: found.title,
        description: found.description || "",
        status: found.status,
        image: found.image || null,
      });
      setPreview(found.image || null);
      setImageChanged(false);
      setError("");
    } catch (err) {
      console.error("Error fetching todo:", err);
      setError("Failed to load todo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === "pending" ? "completed" : "pending",
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    // cleanup old blob preview
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);

    const newPreview = URL.createObjectURL(file);
    setPreview(newPreview);
    setFormData((prev) => ({ ...prev, image: file }));
    setImageChanged(true);
    setError("");
  };

  const removeImage = () => {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);

    setPreview(null);
    setFormData((prev) => ({ ...prev, image: null }));
    setImageChanged(true);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const restoreOriginalImage = () => {
    if (!todo) return;

    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);

    setPreview(todo.image || null);
    setFormData((prev) => ({ ...prev, image: todo.image || null }));
    setImageChanged(false);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setError("");

    try {
      let finalImage = formData.image;

      // If a new file was selected, convert to base64
      if (imageChanged && formData.image instanceof File) {
        finalImage = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result); // base64 data URL
          reader.onerror = reject;
          reader.readAsDataURL(formData.image);
        });
      }

      const updatedTodo = {
        ...todo,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        image: finalImage, 
        updatedAt: new Date().toISOString(),
      };

      await api.put(updatedTodo);
      navigate("/todos");
    } catch (err) {
      console.error("Error updating todo:", err);
      setError("Failed to update todo. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-lg mx-auto">
          <div className="mb-8 animate-pulse">
            <div className="h-6 w-32 bg-gray-300 rounded mb-6"></div>
            <div className="h-10 w-48 bg-gray-300 rounded-lg mb-2"></div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
                <div className="h-12 bg-gray-300 rounded-xl"></div>
              </div>
            ))}
            <div className="h-12 bg-gray-400 rounded-xl mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/todos")}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Edit Todo
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-600 text-sm">{error}</p>
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors"
                placeholder="What needs to be done?"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none resize-none transition-colors"
                placeholder="Add details, notes, or instructions..."
                rows="4"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={toggleStatus}
                  disabled={saving}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
                    formData.status === "pending"
                      ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }`}
                >
                  {formData.status === "pending" ? (
                    <>
                      <Clock className="w-5 h-5" />
                      Pending
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Completed
                    </>
                  )}
                </button>

                <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                  Click to toggle
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                {imageChanged && (
                  <button
                    type="button"
                    onClick={restoreOriginalImage}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                    disabled={saving}
                  >
                    Restore original
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={saving}
              />

              {!preview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer"
                >
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 font-medium mb-2">
                    Click to upload new image
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
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-2xl flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="px-4 py-2 bg-white text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {imageChanged ? "New image selected" : "Original image"}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate("/todos")}
                disabled={saving}
                className="flex-1 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
                  saving
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update Todo
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Make changes and save to update your todo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
