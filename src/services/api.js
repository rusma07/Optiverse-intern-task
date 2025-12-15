// Axios-style mock API using localStorage

const STORAGE_KEY = "todos";

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const api = {
  get: async () => {
    await delay(500);
    return {
      data: JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    };
  },

  getById: async (id) => {
    await delay(300);
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return { data: todos.find(t => t.id === Number(id)) };
  },

  post: async (todo) => {
    await delay(300);
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    todos.push(todo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    return { data: todo };
  },

  put: async (updatedTodo) => {
    await delay(300);
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const index = todos.findIndex(t => t.id === updatedTodo.id);
    todos[index] = updatedTodo;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    return { data: updatedTodo };
  },

  delete: async (id) => {
    await delay(300);
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(todos.filter(t => t.id !== id))
    );
    return { data: true };
  }
};

export default api;
