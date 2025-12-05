import React, { useEffect, useState } from "react";
import { getLogs } from "@/api/SuperadminApi";
import { RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await getLogs();
      setLogs(res); // ✅ FIXED: backend returns array, not {data}
    } catch (err) {
      toast.error("Failed to load logs");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    try {
      const res = await getLogs();
      setLogs(res); // ✅ FIXED
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">System Logs</h1>

        <button
          onClick={refresh}
          disabled={refreshing}
          className="flex items-center gap-2 bg-gray-100 border px-4 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
        >
          <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading logs...</div>
      ) : logs.length === 0 ? (
        <div className="text-gray-500 text-sm">No logs found</div>
      ) : (
        <div className="bg-white shadow rounded-xl border overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Level</th>
                <th className="p-3">Message</th>
                <th className="p-3">Module</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: any, i: number) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-3">{log.timestamp}</td>
                  <td className="p-3 font-medium text-red-600">{log.level}</td>
                  <td className="p-3">{log.message}</td>
                  <td className="p-3 text-gray-600">{log.module}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
