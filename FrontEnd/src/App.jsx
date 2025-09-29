import "./App.css";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import PageNotfound from "./components/PageNotfound.jsx";
import { Home } from "./components/Home.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("jwt"));

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={token ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<PageNotfound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
