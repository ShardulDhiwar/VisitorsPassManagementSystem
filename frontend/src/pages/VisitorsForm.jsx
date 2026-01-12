import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useAppointments } from "../context/AppointmentsContext"; // ✅ added

import LoginSVG from "../assets/LoginSVG.png";
import GateKeeper from "../assets/GateKeeper.png";
import GateKeeperWhite from "../assets/GateKeeperWhite.png";

const VisitorForm = () => {
  const { refetch } = useAppointments(); // 🔥 CONTEXT REFRESH
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    purpose: "",
    whomToMeet: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/visitors/register", formData);

      // 🔥 THIS IS THE REFRESH FIX
      await refetch();

      toast.success(
        <div>
          <p className="font-semibold">Appointment request submitted</p>
          <p className="text-sm">
            You'll receive your entry pass on your email after approval.
          </p>
        </div>
      );

      setFormData({
        name: "",
        phone: "",
        email: "",
        purpose: "",
        whomToMeet: "",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f6f4e8]">
      {/* LEFT — VISITOR FORM */}
      <div className="w-full lg:w-1/4 flex items-center justify-center flex-col">
        <div className="flex flex-col justify-center w-80 min-h-120 max-w-md bg-[#f6f6ef] p-8 pt-4 rounded-xl shadow-lg border-2 border-green-400">
          <div className="flex flex-col items-center mb-4">
            <img
              src={GateKeeper}
              alt="GateKeeper Logo"
              className="w-14 h-auto"
            />
            <h1 className="text-3xl font-bold text-[#163f38] mt-2">
              GateKeeper
            </h1>
          </div>

          <h2 className="text-xl text-[#163f38] text-center mb-4">
            Visitor Appointment
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-200 text-black outline-none focus:ring-2 focus:ring-green-400"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-200 text-black outline-none focus:ring-2 focus:ring-green-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-200 text-black outline-none focus:ring-2 focus:ring-green-400"
            />

            <input
              type="text"
              name="whomToMeet"
              placeholder="Whom to Meet (e.g. HR)"
              value={formData.whomToMeet}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-200 text-black outline-none focus:ring-2 focus:ring-green-400"
            />

            <input
              type="text"
              name="purpose"
              placeholder="Purpose of Visit"
              value={formData.purpose}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-200 text-black outline-none focus:ring-2 focus:ring-green-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-400 hover:bg-green-500 text-black py-3 rounded font-semibold disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Request Appointment"}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden lg:flex lg:w-3/4 items-start bg-[#017d48] pl-8 pt-8 relative">
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

          <h3 className="text-white text-2xl font-semibold mb-4">
            What happens when you submit?
          </h3>

          <ul className="text-white text-md space-y-2 list-disc list-inside max-w-2xl">
            <li>Your appointment request is sent for approval</li>
            <li>Admin or security will review your details</li>
            <li>
              Once approved, you'll receive your{" "}
              <span className="font-semibold">entry pass</span> via email
            </li>
            <li>Show the pass at the gate for quick check-in</li>
          </ul>
          <Link
            to="/login"
            className="inline-block text-slate-200 text-xl underline hover:text-slate-400 mt-8"
          >
            ←Back to Login Page
          </Link>
        </div>

        <img
          src={LoginSVG}
          alt="Login Illustration"
          className="absolute bottom-8 right-8 w-190 animate-slow-bounce"
        />
      </div>
    </div>
  );
};

export default VisitorForm;

// import { useState } from "react";
// import api from "../api/axios";
// import { toast } from "react-toastify";
// import { useAppointments } from "../context/AppointmentsContext";

// const VisitorsForm = () => {
//   const { refetch } = useAppointments(); // 🔥 CONTEXT REFRESH
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     purpose: "",
//     whomToMeet: "",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       await api.post("/visitors/register", formData);

//       // 🔥 THIS FIXES THE REFRESH ISSUE
//       await refetch();

//       toast.success(
//         <div>
//           <p className="font-semibold">Appointment request submitted</p>
//           <p className="text-sm">
//             You will receive your QR pass after approval.
//           </p>
//         </div>
//       );

//       // Reset form
//       setFormData({
//         name: "",
//         phone: "",
//         email: "",
//         purpose: "",
//         whomToMeet: "",
//       });
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
//       <h2 className="text-xl font-bold mb-4">Visitor Registration</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           placeholder="Visitor Name"
//           required
//           className="w-full p-2 border rounded"
//         />

//         <input
//           name="phone"
//           value={formData.phone}
//           onChange={handleChange}
//           placeholder="Phone"
//           required
//           className="w-full p-2 border rounded"
//         />

//         <input
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           placeholder="Email"
//           type="email"
//           required
//           className="w-full p-2 border rounded"
//         />

//         <input
//           name="purpose"
//           value={formData.purpose}
//           onChange={handleChange}
//           placeholder="Purpose of Visit"
//           required
//           className="w-full p-2 border rounded"
//         />

//         <input
//           name="whomToMeet"
//           value={formData.whomToMeet}
//           onChange={handleChange}
//           placeholder="Whom to meet (e.g. Manager, HR)"
//           required
//           className="w-full p-2 border rounded"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//         >
//           {loading ? "Submitting..." : "Submit"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default VisitorsForm;
