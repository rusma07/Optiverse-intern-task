import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Filter,
  ChevronRight,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import api from "../services/api";
import TodoCard from "../components/TodoCard";
import ConfirmationModal from "../components/ConfirmationModal"; // ✅ use modal from components

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // Delete modal state
  const [deleteTodoId, setDeleteTodoId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await api.get();
      setTodos(res.data || []);
      setFilteredTodos(res.data || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ✅ Status-only filter
  useEffect(() => {
    let filtered = [...todos];
    if (statusFilter !== "all") {
      filtered = filtered.filter((todo) => todo.status === statusFilter);
    }
    setFilteredTodos(filtered);
  }, [todos, statusFilter]);

  const openDeleteModal = (id) => setDeleteTodoId(id);
  const closeDeleteModal = () => {
    if (deleteLoading) return;
    setDeleteTodoId(null);
  };

  const confirmDelete = async () => {
    if (!deleteTodoId) return;
    setDeleteLoading(true);
    try {
      await api.delete(deleteTodoId);
      await fetchTodos();
      setDeleteTodoId(null);
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("Failed to delete todo. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleTodoStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "pending" ? "completed" : "pending";
      await api.update(id, { status: newStatus });
      await fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50">
        <span className="text-gray-700 font-semibold">Loading...</span>
      </div>
    );
  }

  const completedCount = todos.filter((t) => t.status === "completed").length;
  const pendingCount = todos.filter((t) => t.status === "pending").length;

  const selectedTodo = deleteTodoId
    ? todos.find((t) => t.id === deleteTodoId)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* ✅ Delete Confirmation Modal */}
      <ConfirmationModal
        open={Boolean(deleteTodoId)}
        title="Delete todo?"
        message={
          selectedTodo
            ? `This will permanently delete “${selectedTodo.title}”.`
            : "This will permanently delete this todo."
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
        loading={deleteLoading}
        danger
        disableOutsideClose={deleteLoading}
        icon={<Trash2 className="w-5 h-5" />}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              My Todo List
            </h1>
            <p className="text-gray-600">Stay organized and track your tasks</p>
          </div>

          <Link
            to="/todos/create"
            className="mt-4 sm:mt-0 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            New Todo
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">
                  {todos.length}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Filter className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {completedCount}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-3xl font-bold text-amber-600">
                  {pendingCount}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter (status only) */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
          <p className="text-gray-600 flex-1">Filter todos by Status</p>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="md:w-48 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Empty State */}
        {filteredTodos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="inline-flex p-4 bg-indigo-100 rounded-full mb-4">
              <AlertCircle className="w-12 h-12 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {statusFilter !== "all" ? "No matching todos" : "No todos yet"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {statusFilter !== "all"
                ? "Try adjusting your filter to find todos."
                : "Get started by creating your first todo item!"}
            </p>
            <Link
              to="/todos/create"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Your First Todo
            </Link>
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold">{filteredTodos.length}</span> of{" "}
                <span className="font-semibold">{todos.length}</span> todos
              </p>
              <button
                onClick={fetchTodos}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <ChevronRight className="w-4 h-4 rotate-90" />
                Refresh
              </button>
            </div>

            {/* Todo Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTodos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onToggleStatus={toggleTodoStatus}
                  onDelete={openDeleteModal}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
