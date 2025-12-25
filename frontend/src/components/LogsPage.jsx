// 
import { useEffect, useMemo, useState } from "react";
import StatCard from "./StatsCard";
import api from "../api/axios";
import {
  ClipboardList,
  DoorClosed,
  DoorOpen,
  Download,
  Users,
} from "lucide-react";
import { toast } from "react-toastify";

/* ---------------- SMALL STAT CARD ---------------- */

// const StatCard = ({ title, value, icon, color = "blue" }) => (
//   <div className="p-5 rounded-xl shadow bg-white border-l-4 border-green-500">
//     <div className="flex items-center gap-3">
//       <div className="text-2xl">{icon}</div>
//       <h3 className="text-gray-600 font-medium">{title}</h3>
//     </div>
//     <p className="text-3xl font-bold mt-3">{value}</p>
//   </div>
// );

const ROWS_PER_PAGE = 5;

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);

  const [actionFilter, setActionFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  /* ---------------- FETCH ---------------- */

  const fetchLogs = async () => {
    try {
      const res = await api.get("/check/logs");
      setLogs(res.data.data);
    } catch {
      toast.error("Failed to load logs");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  /* ---------------- FILTER + SEARCH ---------------- */

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesAction =
        actionFilter === "ALL" || log.action === actionFilter;

      const keyword = search.toLowerCase();
      const matchesSearch =
        log.visitorId?.name?.toLowerCase().includes(keyword) ||
        log.passId?.token?.toLowerCase().includes(keyword);

      return matchesAction && matchesSearch;
    });
  }, [logs, actionFilter, search]);

  /* ---------------- PAGINATION ---------------- */

  const totalPages = Math.ceil(filteredLogs.length / ROWS_PER_PAGE);
  const startIndex = (page - 1) * ROWS_PER_PAGE;
  const currentLogs = filteredLogs.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE
  );

  /* ---------------- CSV DOWNLOAD ---------------- */

  const downloadCSV = () => {
    if (filteredLogs.length === 0) {
      toast.info("No logs to download");
      return;
    }

    const headers = [
      "Visitor Name",
      "Action",
      "Pass Token",
      "Done By",
      "Date & Time",
    ];

    const rows = filteredLogs.map((log) => [
      log.visitorId?.name || "",
      log.action,
      log.passId?.token || "",
      log.doneBy,
      new Date(log.createdAt).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "logs.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  /* ---------------- STATS ---------------- */

  const totalLogs = logs.length;
  const checkIns = logs.filter((l) => l.action === "check-in").length;
  const checkOuts = logs.filter((l) => l.action === "check-out").length;
  const inside = Math.max(checkIns - checkOuts, 0);


  /* ---------------- UI ---------------- */

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Security Logs</h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Logs"
          value={totalLogs}
          icon={<ClipboardList />}
          bg="border-blue-500"
        />
        <StatCard
          title="Check-ins"
          value={checkIns}
          icon={<DoorOpen />}
          bg="border-green-500"
        />
        <StatCard
          title="Check-outs"
          value={checkOuts}
          icon={<DoorClosed />}
          bg="border-red-500"
        />
        <StatCard
          title="Inside"
          value={inside}
          icon={<Users />}
          bg="border-orange-500"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white p-4 rounded-xl shadow">
        {/* TOP CONTROLS */}
        <div className="flex flex-wrap gap-3 justify-between mb-4">
          <div className="flex gap-2">
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              className="border p-2 rounded"
            >
              <option value="ALL">All</option>
              <option value="check-in">Check-in</option>
              <option value="check-out">Check-out</option>
            </select>

            <input
              placeholder="Search name or token"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border p-2 rounded"
            />
          </div>

          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 border px-3 py-2 rounded hover:bg-gray-100"
          >
            <Download size={16} />
            Download CSV
          </button>
        </div>

        {/* TABLE */}
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Visitor</th>
              <th>Action</th>
              <th>Token</th>
              <th>Done By</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {currentLogs.map((log) => (
              <tr key={log._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{log.visitorId?.name}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium
                      ${
                        log.action === "check-in"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="font-mono">{log.passId?.token}</td>
                <td>{log.doneBy}</td>
                <td className="text-gray-600">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-evenly items-center mt-4 text-sm">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Previous
          </button>

          <span>
            Page <strong>{page}</strong> of <strong>{totalPages || 1}</strong>
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};



export default LogsPage;
