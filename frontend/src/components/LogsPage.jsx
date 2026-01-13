import { useEffect, useMemo, useState } from "react";
import StatCard from "./StatsCard";
import api from "../api/axios";
import {
  ClipboardList,
  DoorClosed,
  DoorOpen,
  Download,
  Users,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "react-toastify";

const ROWS_PER_PAGE = 8;

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState("ALL");
  const [search, setSearch] = useState("");

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

  const totalPages = Math.ceil(filteredLogs.length / ROWS_PER_PAGE);
  const startIndex = (page - 1) * ROWS_PER_PAGE;
  const currentLogs = filteredLogs.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE
  );

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

  const totalLogs = logs.length;
  const checkIns = logs.filter((l) => l.action === "check-in").length;
  const checkOuts = logs.filter((l) => l.action === "check-out").length;
  const inside = Math.max(checkIns - checkOuts, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Security Logs</h1>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-150 shadow-md hover:shadow-lg"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          title="Currently Inside"
          value={inside}
          icon={<Users />}
          bg="border-orange-500"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[250px] relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              placeholder="Search by name or token..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150"
            />
          </div>

          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 appearance-none bg-white"
            >
              <option value="ALL">All Actions</option>
              <option value="check-in">Check-in</option>
              <option value="check-out">Check-out</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-700">
                  Visitor
                </th>
                <th className="p-4 text-left font-semibold text-gray-700">
                  Action
                </th>
                <th className="p-4 text-left font-semibold text-gray-700">
                  Token
                </th>
                <th className="p-4 text-left font-semibold text-gray-700">
                  Done By
                </th>
                <th className="p-4 text-left font-semibold text-gray-700">
                  Time
                </th>
              </tr>
            </thead>

            <tbody>
              {currentLogs.length > 0 ? (
                currentLogs.map((log) => (
                  <tr
                    key={log._id}
                    className="border-b hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {log.visitorId?.name || "N/A"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                          log.action === "check-in"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {log.action === "check-in" ? (
                          <DoorOpen size={14} />
                        ) : (
                          <DoorClosed size={14} />
                        )}
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-gray-600">
                      {log.passId?.token || "N/A"}
                    </td>
                    <td className="p-4 text-gray-700">
                      {log.doneBy || "System"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 text-sm">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-150"
          >
            Previous
          </button>

          <span className="text-gray-600">
            Page <strong className="text-gray-800">{page}</strong> of{" "}
            <strong className="text-gray-800">{totalPages || 1}</strong>
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-150"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
