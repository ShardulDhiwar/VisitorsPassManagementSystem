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

const ROWS_PER_PAGE = 6;

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Security Logs</h1>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Logs"
          value={totalLogs}
          icon={<ClipboardList size={20} />}
        />
        <StatCard
          title="Check-ins"
          value={checkIns}
          icon={<DoorOpen size={20} />}
        />
        <StatCard
          title="Check-outs"
          value={checkOuts}
          icon={<DoorClosed size={20} />}
        />
        <StatCard
          title="Currently Inside"
          value={inside}
          icon={<Users size={20} />}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[250px] relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            placeholder="Search by name or token..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="relative">
          <Filter
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="pl-10 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
          >
            <option value="ALL">All Actions</option>
            <option value="check-in">Check-in</option>
            <option value="check-out">Check-out</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Visitor
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Action
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Token
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Done By
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Time
              </th>
            </tr>
          </thead>

          <tbody>
            {currentLogs.length > 0 ? (
              currentLogs.map((log) => (
                <tr
                  key={log._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-sm text-gray-900">
                    {log.visitorId?.name || "N/A"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium ${
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
                  <td className="p-4 text-sm font-mono text-gray-600">
                    {log.passId?.token || "N/A"}
                  </td>
                  <td className="p-4 text-sm text-gray-900">
                    {log.doneBy || "System"}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="p-8 text-center text-gray-500 text-sm"
                >
                  No logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 p-4 border-t border-gray-200">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            &lt; Previous
          </button>

          {[...Array(totalPages || 1)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                page === i + 1
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}

          {totalPages > 3 && <span className="text-gray-400">...</span>}

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
