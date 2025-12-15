import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TodoList from "./pages/TodoList";
import CreateTodo from "./pages/CreateTodo";
import EditTodo from "./pages/EditTodo";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/todos" />} />
        <Route path="/todos" element={<TodoList />} />
        <Route path="/todos/create" element={<CreateTodo />} />
        <Route path="/todos/:id/edit" element={<EditTodo />} />
      </Routes>
    </BrowserRouter>
  );
}
