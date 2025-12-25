import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import StatCard from "../../components/StatsCard";
import { ClipboardList, ShieldUser, UserRound, UserRoundCog } from "lucide-react";

const SecurityDashboard = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [passData, setPassData] = useState(null);
  const [mode, setMode] = useState("SCAN"); // SCAN | MANUAL

  // Dynamic data
  const [visitors, setVisitors] = useState([]);

  /* ---------------- FETCH VISITORS ---------------- */

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

  /* ---------------- KPI VALUES ---------------- */

  const insideCount = visitors.filter((v) => v.isInside).length;
  const checkedInCount = visitors.filter((v) => v.entryTime).length;
  const checkedOutCount = visitors.filter((v) => v.exitTime).length;
  const totalVisitors = visitors.length;

  /* ---------------- SCAN PASS ---------------- */

  const scanPass = async () => {
    if (!token) return toast.info("Enter pass token");
    try {
      setLoading(true);
      const res = await api.get(`/passes/scan/${token}`);

      // API returns { pass, visitor, log } → use pass + visitor
      const pass = res.data.data.pass;
      const visitor = res.data.data.visitor;

      setPassData({
        ...pass,
        visitor,
      });

      toast.success("Pass verified");

      // Refresh visitors to update KPIs
      await fetchVisitors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Scan failed");
      setPassData(null);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- MANUAL FETCH ---------------- */

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

  /* ---------------- UPDATE STATUS ---------------- */

  const updateStatus = async (newStatus) => {
    try {
      setLoading(true);
      await api.patch(`/passes/${passData._id}/status`, { status: newStatus });
      toast.success(
        newStatus === "used" ? "Check-in successful" : "Check-out successful"
      );

      // Update status locally so UI reflects instantly
      setPassData((prev) => ({ ...prev, status: newStatus }));

      // Refresh visitors for KPIs
      await fetchVisitors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Security Dashboard</h1>

      {/* KPI CARDS */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Visitors Inside",
            value: insideCount,
            color: "bg-green-100 text-green-700",
          },
          {
            label: "Checked In",
            value: checkedInCount,
            color: "bg-blue-100 text-blue-700",
          },
          {
            label: "Checked Out",
            value: checkedOutCount,
            color: "bg-gray-100 text-gray-700",
          },
          {
            label: "Total Visitors",
            value: totalVisitors,
            color: "bg-purple-100 text-purple-700",
          },
        ].map((item, i) => (
          <div key={i} className={`p-4 rounded-xl shadow ${item.color}`}>
            <p className="text-sm">{item.label}</p>
            <p className="text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Visitors Inside"
          value={insideCount}
          icon={<ClipboardList />}
          bg="border-blue-500"
        />
        <StatCard
          title="Checked In"
          value={checkedInCount}
          icon={<UserRoundCog />}
          bg="border-green-500"
        />
        <StatCard
          title="Checked Out"
          value={checkedOutCount}
          icon={<ShieldUser />}
          bg="border-red-500"
        />
        <StatCard
          title="Total Visitors"
          value={totalVisitors}
          icon={<UserRound />}
          bg="border-orange-500"
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* MODE TOGGLE */}
          <div className="flex gap-2">
            <button
              onClick={() => setMode("SCAN")}
              className={`px-4 py-2 rounded ${
                mode === "SCAN" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Scan Mode
            </button>

            <button
              onClick={() => setMode("MANUAL")}
              className={`px-4 py-2 rounded ${
                mode === "MANUAL" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Manual Mode
            </button>
          </div>

          {/* TOKEN INPUT */}
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex gap-3">
              <input
                placeholder="Scan or enter pass token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="flex-1 border p-2 rounded"
              />
              {mode === "SCAN" ? (
                <button
                  onClick={scanPass}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 rounded"
                >
                  Verify
                </button>
              ) : (
                <button
                  onClick={fetchByPass}
                  disabled={loading}
                  className="bg-orange-600 text-white px-4 rounded"
                >
                  Fetch
                </button>
              )}
            </div>
          </div>

          {/* VISITOR CARD */}
          {passData ? (
            <div className="bg-white p-5 rounded-xl shadow border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold">
                {passData.visitor?.name}
              </h3>

              <p className="text-sm text-gray-500">
                Token: <span className="font-mono">{passData.token}</span>
              </p>

              <p className="text-sm">
                Status: <strong>{passData.status}</strong>
              </p>

              <div className="flex gap-3 mt-4">
                {passData.status === "issued" && (
                  <button
                    onClick={() => updateStatus("used")}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Check-in
                  </button>
                )}
                {passData.status === "used" && (
                  <button
                    onClick={() => updateStatus("expired")}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Check-out
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
              Ready to scan a visitor pass
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* CURRENTLY INSIDE */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Currently Inside</h3>
            <ul className="space-y-2 text-sm">
              {visitors
                .filter((v) => v.isInside)
                .slice(-3) // take only last 3 visitors
                .map((v) => (
                  <li key={v._id} className="flex justify-between">
                    <span>{v.name}</span>
                    <span className="text-green-600">●</span>
                  </li>
                ))}

              {insideCount === 0 && (
                <li className="text-gray-400 text-center">
                  No visitors inside
                </li>
              )}
            </ul>
          </div>

          {/* SYSTEM STATUS */}
          <div className="bg-white p-4 rounded-xl shadow text-sm">
            <p>System Online</p>
            <p>Shift: Morning</p>
            <p>Guard: Security Staff</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;
