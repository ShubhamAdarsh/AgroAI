import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 availability state
  const [available, setAvailable] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  // =========================
  // 📊 LOAD HISTORY
  // =========================
  useEffect(() => {
    fetch("http://localhost:8000/history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setHistory(data.data || []))
      .catch(() => setError("Failed to load dashboard 🚨"))
      .finally(() => setLoading(false));
  }, [token]);

  // =========================
  // 🔥 LOAD AVAILABILITY FROM BACKEND
  // =========================
  useEffect(() => {
    fetch("http://localhost:8000/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAvailable(data.available || false);
      })
      .catch(() => console.log("Failed to load availability"))
      .finally(() => setStatusLoading(false));
  }, [token]);

  // =========================
  // 🔄 TOGGLE AVAILABILITY
  // =========================
  const toggleAvailability = async () => {
    const newStatus = !available;

    // optimistic UI update
    setAvailable(newStatus);

    try {
      const res = await fetch("http://localhost:8000/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔐 FIXED (IMPORTANT)
        },
        body: JSON.stringify({
          email: email,
          available: newStatus,
        }),
      });

      if (!res.ok) throw new Error();
    } catch (err) {
      console.error("Availability update failed");
      setAvailable(!newStatus); // rollback if failed
    }
  };

  // =========================
  // 📊 PROCESS DATA
  // =========================
  const cropCount = {};
  history.forEach((item) => {
    let crop = item.recommended_crop || "Unknown";

    crop = crop
      .replaceAll("{", "")
      .replaceAll("}", "")
      .replaceAll('"', "")
      .replaceAll("'", "")
      .split(",")[0]
      .trim();

    cropCount[crop] = (cropCount[crop] || 0) + 1;
  });

  const cropData = Object.keys(cropCount)
    .map((crop) => ({
      crop,
      count: cropCount[crop],
    }))
    .sort((a, b) => b.count - a.count);

  const topCrop = cropData.length > 0 ? cropData[0].crop : "N/A";

  const dateCount = {};
  history.forEach((item) => {
    const date = new Date(item.created_at).toLocaleDateString();
    dateCount[date] = (dateCount[date] || 0) + 1;
  });

  const timeData = Object.keys(dateCount)
    .map((date) => ({
      date,
      count: dateCount[date],
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // =========================
  // 🎨 UI
  // =========================
  return (
    <Layout>
      <h1 className="text-3xl mb-6 gradient-text">
        Dashboard 📊
      </h1>

      {/* 🔄 LOADING */}
      {loading && (
        <div className="text-gray-400 animate-pulse">
          Loading dashboard...
        </div>
      )}

      {/* ❌ ERROR */}
      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* 🔥 AVAILABILITY CARD */}
          <div className="glass p-6 mb-8 flex justify-between items-center hover:shadow-xl transition">

            <div>
              <h2 className="text-lg text-gray-400">Work Status</h2>

              <p className="text-xl font-bold flex items-center gap-2">
                {statusLoading ? (
                  <span className="animate-pulse text-gray-400">
                    Checking...
                  </span>
                ) : (
                  <>
                    <span className={`${available ? "animate-pulse" : ""}`}>
                      {available ? "🟢" : "🔴"}
                    </span>
                    {available
                      ? "Available for Work"
                      : "Not Available"}
                  </>
                )}
              </p>
            </div>

            <button
              onClick={toggleAvailability}
              disabled={statusLoading}
              className={`px-6 py-2 rounded-xl transition ${
                available
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } ${statusLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {available ? "Go Offline" : "Go Available"}
            </button>

          </div>

          {/* 🔢 STATS */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="glass p-6 text-center hover:scale-105 transition">
              <h2 className="text-lg text-gray-400">Total Analyses</h2>
              <p className="text-3xl font-bold">{history.length}</p>
            </div>

            <div className="glass p-6 text-center hover:scale-105 transition">
              <h2 className="text-lg text-gray-400">Top Crop</h2>
              <p className="text-2xl font-bold text-green-400 capitalize">
                {topCrop}
              </p>
            </div>

            <div className="glass p-6 text-center hover:scale-105 transition">
              <h2 className="text-lg text-gray-400">Unique Crops</h2>
              <p className="text-2xl font-bold">
                {cropData.length}
              </p>
            </div>
          </div>

          {/* 📊 BAR CHART */}
          <div className="glass p-6 mb-8 hover:shadow-xl transition">
            <h2 className="text-xl mb-4">Crop Distribution 🌾</h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cropData}>
                <XAxis dataKey="crop" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 📈 LINE CHART */}
          <div className="glass p-6 hover:shadow-xl transition">
            <h2 className="text-xl mb-4">Usage Over Time 📈</h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </Layout>
  );
}