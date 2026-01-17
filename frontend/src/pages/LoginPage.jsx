import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import LoginSVG from "../assets/LoginSVG.png";
// import LoginSVG from "../assets/LoginSVGgreen.png";
import GateKeeper from "../assets/GateKeeper.png";
import GateKeeperWhite from "../assets/GateKeeperWhite.png";

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

      if (res.data.user.role === "ADMIN") navigate("/admin");
      else if (res.data.user.role === "SECURITY") navigate("/security");
      else navigate("/employee");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f6f4e8]">
      {/* LEFT — LOGIN FORM */}
      <div className="w-full lg:w-1/4 flex items-center justify-center flex-col">
        <div className=" flex flex-col justify-center w-80 h-120 max-w-md bg-[#f6f6ef] p-8 pt-0 rounded-xl shadow-lg border-2 border-black">
          <div className="flex flex-col items-center justify-start">
            <img
              src={GateKeeper}
              alt="GateKeeper Logo"
              className="w-15 h-auto mx-2"
            />
            <h1 className="text-3xl font-bold text-black text-center mb-6 ">
              GateKeeper
            </h1>
          </div>
          <h1 className="text-xl  text-black text-center mb-6">
            Log in to your account
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
              className="w-full p-3 rounded bg-gray-200 text-black outline-none focus:ring-2 focus:ring-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded bg-gray-200 text-black outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="w-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900  text-white hover:from-gray-800 hover:to-gray-700 py-3 rounded font-semibold transition-all">
              Sign In
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT — IMAGE */}
      <div className="hidden lg:flex lg:w-3/4 items-start bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900  pl-8 pt-8 relative">
        <div className="w-full">
          <div className="flex items-center mb-4">
            <img
              src={GateKeeperWhite}
              alt="GateKeeper Logo"
              className="w-10 h-auto"
            />
            <h2 className="text-white text-3xl font-bold ml-3">GateKeeper</h2>
          </div>

          <hr className="border-white/30 mb-6 max-w-2xl" />

          <p className="text-white text-lg mb-8 leading-relaxed max-w-2xl">
            GateKeeper is a secure visitor and access management system that
            streamlines check-ins, appointments, and on-site security for
            organizations.
          </p>

          <Link
            to="/visitorsForm"
            className="inline-block text-slate-200 text-xl underline hover:text-slate-400 mb-8"
          >
            Get Appointment as a Visitor →
          </Link>
        </div>

        {/* Image positioned at bottom right */}
        <img
          src={LoginSVG}
          alt="Login Illustration"
          className="absolute bottom-7 right-8 w-200 opacity-40 rounded-2xl animate-slow-bounce"
        />
      </div>
    </div>
  );
};

export default LoginPage;
