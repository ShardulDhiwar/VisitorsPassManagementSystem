import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import StatCard from "../../components/StatsCard";
import {
  ArrowRightToLine,
  DoorClosed,
  DoorOpen,
  Users,
  Scan,
  User,
} from "lucide-react";

const SecurityDashboard = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [passData, setPassData] = useState(null);
  const [mode, setMode] = useState("SCAN");
  const [visitors, setVisitors] = useState([]);

  const fetchVisitors = async () => {
    try {
      const res = await api.get("/visitors");
      setVisitors(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch visitors");
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const insideCount = visitors.filter((v) => v.isInside).length;
  const checkedInCount = visitors.filter((v) => v.entryTime).length;
  const checkedOutCount = visitors.filter((v) => v.exitTime).length;
  const totalVisitors = visitors.length;

  const scanPass = async () => {
    if (!token) return toast.info("Enter pass token");
    try {
      setLoading(true);
      const res = await api.get(`/passes/scan/${token}`);

      const pass = res.data.data.pass;
      const visitor = res.data.data.visitor;

      setPassData({
        ...pass,
        visitor,
      });

      toast.success("Pass verified");
      await fetchVisitors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Scan failed");
      setPassData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchByPass = async () => {
    if (!token) return toast.info("Enter pass token");

    try {
      setLoading(true);
      const res = await api.get(`/visitors/my-pass/${token}`);

      setPassData(res.data.data);
      toast.success("Visitor fetched");

      await fetchVisitors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Fetch failed");
      setPassData(null);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      setLoading(true);
      await api.patch(`/passes/${passData._id}/status`, { status: newStatus });
      toast.success(
        newStatus === "used" ? "Check-in successful" : "Check-out successful"
      );

      setPassData((prev) => ({ ...prev, status: newStatus }));
      await fetchVisitors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Security Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Monitor and manage visitor check-ins
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Visitors Inside"
          value={insideCount}
          icon={<ArrowRightToLine />}
          bg="border-blue-500"
        />
        <StatCard
          title="Checked In"
          value={checkedInCount}
          icon={<DoorOpen />}
          bg="border-green-500"
        />
        <StatCard
          title="Checked Out"
          value={checkedOutCount}
          icon={<DoorClosed />}
          bg="border-red-500"
        />
        <StatCard
          title="Total Visitors"
          value={totalVisitors}
          icon={<Users />}
          bg="border-orange-500"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mode Toggle */}
          <div className="flex gap-3">
            <button
              onClick={() => setMode("SCAN")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-150 ${
                mode === "SCAN"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                  : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-500"
              }`}
            >
              <Scan size={20} />
              Scan Mode
            </button>

            <button
              onClick={() => setMode("MANUAL")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-150 ${
                mode === "MANUAL"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                  : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-500"
              }`}
            >
              <User size={20} />
              Manual Mode
            </button>
          </div>

          {/* Token Input Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {mode === "SCAN" ? "Scan Pass Token" : "Enter Pass Token"}
            </label>
            <div className="flex gap-3">
              <input
                placeholder="Enter or scan pass token..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150"
              />
              {mode === "SCAN" ? (
                <button
                  onClick={scanPass}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 rounded-lg font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {loading ? "Verifying..." : "Verify"}
                </button>
              ) : (
                <button
                  onClick={fetchByPass}
                  disabled={loading}
                  className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 rounded-lg font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {loading ? "Fetching..." : "Fetch"}
                </button>
              )}
            </div>
          </div>

          {/* Visitor Card */}
          {passData ? (
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-lg border-l-4 border-blue-600">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {passData.visitor?.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Token:{" "}
                    <span className="font-mono font-semibold">
                      {passData.token}
                    </span>
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    passData.status === "issued"
                      ? "bg-yellow-100 text-yellow-700"
                      : passData.status === "used"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {passData.status.toUpperCase()}
                </span>
              </div>

              <div className="flex gap-3 mt-6">
                {passData.status === "issued" && (
                  <button
                    onClick={() => updateStatus("used")}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-150 shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    <DoorOpen size={20} />
                    Check-in
                  </button>
                )}
                {passData.status === "used" && (
                  <button
                    onClick={() => updateStatus("expired")}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-150 shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    <DoorClosed size={20} />
                    Check-out
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl shadow-lg text-center">
              <div className="text-gray-400 mb-4">
                <Scan size={64} className="mx-auto" />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                Ready to scan a visitor pass
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {mode === "SCAN" ? "Scan" : "Enter"} a pass token to get started
              </p>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Currently Inside Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="font-semibold text-lg mb-4 text-gray-800 flex items-center gap-2">
              <Users size={20} className="text-blue-600" />
              Currently Inside
            </h3>
            <div className="space-y-3">
              {visitors
                .filter((v) => v.isInside)
                .slice(-5)
                .map((v) => (
                  <div
                    key={v._id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium text-gray-800">{v.name}</span>
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  </div>
                ))}

              {insideCount === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">No visitors inside</p>
                </div>
              )}
            </div>
          </div>

          {/* System Status Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg text-white">
            <h3 className="font-semibold text-lg mb-4">System Status</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Status</span>
                <span className="font-semibold text-green-400">● Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Current Shift</span>
                <span className="font-semibold">Morning</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">On Duty</span>
                <span className="font-semibold">Security Staff</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Time</span>
                <span className="font-semibold">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;
