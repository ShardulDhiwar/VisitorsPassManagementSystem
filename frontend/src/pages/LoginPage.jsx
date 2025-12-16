import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      login(res.data.user, res.data.token);

      // Role-based redirect
      if (res.data.user.role === "ADMIN") navigate("/admin");
      else if (res.data.user.role === "SECURITY") navigate("/security");
      else navigate("/employee");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f2f2a]">
      <div className="w-full max-w-md bg-[#163f38] p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          GateKeeper
        </h1>

        {error && (
          <p className="bg-red-500/20 text-red-400 p-2 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-[#204d45] text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-[#204d45] text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-green-400 py-3 rounded">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
