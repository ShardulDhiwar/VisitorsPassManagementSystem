import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE ", res.data);

      login(res.data.user, res.data.token);
    } catch (err) {
      console.log("LOGIN ERROR ", err.response?.data || err.message);
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
          <div>
            <label className="text-gray-200 text-sm">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-3 rounded bg-[#204d45] text-white outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-gray-200 text-sm">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-3 rounded bg-[#204d45] text-white outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-400 hover:bg-green-500 text-black font-semibold py-3 rounded mt-4 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
