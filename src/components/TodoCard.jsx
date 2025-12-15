import { Link } from "react-router-dom";
import { Edit, Trash2, CheckCircle, Clock, Image as ImageIcon } from "lucide-react";

export default function TodoCard({ todo, onToggleStatus, onDelete }) {
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-indigo-200 transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        {todo.image ? (
          <img
            src={todo.image}
            alt={todo.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => onToggleStatus(todo.id, todo.status)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg ${
              todo.status === "completed"
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            } transition-colors`}
          >
            {todo.status === "completed" ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Completed
              </>
            ) : (
              <>
                <Clock className="w-4 h-4" />
                Pending
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {todo.title}
        </h3>

        {todo.description && (
          <p className="text-gray-600 mb-4 line-clamp-2 min-h-12">
            {todo.description}
          </p>
        )}

        <div className="text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {todo.createdAt && new Date(todo.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <Link
            to={`/todos/${todo.id}/edit`}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>

          <button
            onClick={() => onDelete(todo.id)}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
