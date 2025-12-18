import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import LoginSVG from "../assets/LoginSVG.png";
// import LoginSVG from "../assets/LoginSVGgreen.png";
import GateKeeper from "../assets/GateKeeper.png";
import GateKeeperWhite from "../assets/GateKeeperWhite.png"

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
        <div className=" flex flex-col justify-center w-80 h-120 max-w-md bg-[#f6f6ef] p-8 pt-0 rounded-xl shadow-lg border-2 border-green-400">
          <div className="flex flex-col items-center justify-start">
            <img
              src={GateKeeper}
              alt="GateKeeper Logo"
              className="w-15 h-auto mx-2"
            />
            <h1 className="text-3xl font-bold text-[#163f38] text-center mb-6 ">
              GateKeeper
            </h1>
          </div>
          <h1 className="text-xl  text-[#163f38]  text-center mb-6">
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
              className="w-full p-3 rounded bg-gray-200 text-black outline-none focus:ring-2 focus:ring-green-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded bg-gray-200 text-black outline-none focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="w-full bg-green-400 hover:bg-green-500 text-black py-3 rounded font-semibold">
              Sign In
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT — IMAGE */}
      <div className="hidden lg:flex w-6xl items-center flex-col bg-[#017d48]">
        <div className="p-2 m-2 flex justify-center flex-col ">
          <div className="flex items-center px-2">
            <img
              src={GateKeeperWhite}
              alt="GateKeeper Logo"
              className="w-8 h-auto "
            />
            <h2 className="text-white text-3xl font-bold p-1 m-1">
              GateKeeper
            </h2>
          </div>
          <hr className="text-white" />
          <p className="text-white text-lg w-1/2 p-1 m-1 mt-4">
            GateKeeper is a secure visitor and access management system that
            streamlines check-ins, appointments, and on-site security for
            organizations.
          </p>
          <Link
            to="/visitorsForm"
            className="p-2 text-slate-200 text-2xl underline hover:cursor-pointer hover:text-slate-400 "
          >
            Get Appointment as a Visitor →
          </Link>
        </div>
        <div className="relative w-full flex justify-center p-2 m-4">
          <img
            src={LoginSVG}
            alt="Login Illustration"
            className="absolute right-3 w-200 animate-slow-bounce "
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
