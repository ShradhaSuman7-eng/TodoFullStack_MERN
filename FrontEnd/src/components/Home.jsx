import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const Home = () => {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/todo/fetch`, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        setTodos(response.data.todos);
        setError(null);
      } catch (err) {
        setError("Failed to fetch todos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const todoCreate = async () => {
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post(
        `${BASE_URL}/todo/create`,
        { text: newTodo, completed: false },
        { withCredentials: true }
      );
      setTodos([...todos, response.data.newTodo || response.data]);
      setNewTodo("");
    } catch (err) {
      setError("Failed to create todo");
      console.error(err);
    }
  };

  // Toggle todo status
  const todoStatus = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const response = await axios.put(
        `${BASE_URL}/todo/update/${id}`,
        { ...todo, completed: !todo.completed },
        { withCredentials: true }
      );
      setTodos(todos.map((t) => (t._id === id ? response.data.todo : t)));
    } catch (err) {
      setError("Failed to update todo status");
      console.error(err);
    }
  };

  // Delete a todo
  const todoDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/todo/delete/${id}`, {
        withCredentials: true,
      });
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      setError("Failed to delete todo");
      console.error(err);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.get("${BASE_URL}/user/logout", {
        withCredentials: true,
      });
      toast.success("User logged out successfully");
      localStorage.removeItem("jwt");
      navigate("/login");
    } catch (err) {
      toast.error("Error logging out");
      console.error(err);
    }
  };

  const remainingTodos = todos.filter((t) => !t.completed).length;

  return (
    <div className="bg-gray-100 max-w-lg lg:max-w-xl rounded-lg shadow-lg mx-8 sm:mx-auto p-6">
      <h1 className="text-2xl font-semibold text-center mb-4">Todo App</h1>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && todoCreate()}
          className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={todoCreate}
          className="bg-blue-600 border rounded-r-md text-white px-4 py-2 hover:bg-blue-900 duration-300 disabled:opacity-50"
          disabled={!newTodo.trim()}
        >
          Add
        </button>
      </div>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && (
        <p className="text-center text-red-600 font-semibold">{error}</p>
      )}

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex items-center justify-between p-3 bg-gray-100 rounded-md"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => todoStatus(todo._id)}
                className="mr-2 cursor-pointer"
              />
              <span
                className={`${
                  todo.completed
                    ? "line-through text-gray-500 font-semibold"
                    : "text-gray-800"
                }`}
              >
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => todoDelete(todo._id)}
              className="text-red-500 hover:text-red-800 duration-300"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-center text-sm text-gray-700">
        {remainingTodos} Todos Remaining
      </p>

      <button
        onClick={logout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-800 duration-500 mx-auto block"
      >
        Logout
      </button>
    </div>
  );
};
