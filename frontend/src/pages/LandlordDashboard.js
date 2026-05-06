import { useEffect, useState } from "react";
import Layout from "../components/Layout";

export default function LandlordDashboard() {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/workers", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        setWorkers(data.data || []);
        setFilteredWorkers(data.data || []);
      })
      .catch(() => setError("Failed to load workers 🚨"))
      .finally(() => setLoading(false));
  }, []);

  // 🔍 SEARCH FILTER
  useEffect(() => {
    const filtered = workers.filter((w) => {
      const name = w.name?.toLowerCase() || "";
      const location = w.location?.toLowerCase() || "";
      const skills = w.skills?.join(" ").toLowerCase() || "";

      return (
        name.includes(search.toLowerCase()) ||
        location.includes(search.toLowerCase()) ||
        skills.includes(search.toLowerCase())
      );
    });

    setFilteredWorkers(filtered);
  }, [search, workers]);

  return (
    <Layout>
      <h1 className="text-3xl mb-6 gradient-text">
        Available Workers 👷
      </h1>

      {/* 🔍 SEARCH BAR */}
      <input
        type="text"
        placeholder="Search by name, location, or skills..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-box mb-6 w-full"
      />

      {/* LOADING */}
      {loading && (
        <div className="text-gray-400 animate-pulse">
          Finding workers...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded">
          {error}
        </div>
      )}

      {/* WORKERS */}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 gap-6">

          {filteredWorkers.length === 0 && (
            <p className="text-gray-400">
              No matching workers found.
            </p>
          )}

          {filteredWorkers.map((worker, i) => (
            <div
              key={worker._id || i}
              className="glass p-6 rounded-xl hover:scale-105 hover:shadow-2xl transition duration-300"
            >
              <h2 className="text-xl font-bold mb-2">
                👨‍🌾 {worker.name || "Unnamed Worker"}
              </h2>

              <p className="text-gray-400">
                📍 {worker.location || "Unknown"}
              </p>

              <p className="text-gray-400">
                🛠 {worker.skills?.join(", ") || "No skills listed"}
              </p>

              <p className="text-green-400 mt-2 animate-pulse">
                🟢 Available
              </p>

              <button className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-xl transition w-full">
                Contact 📞
              </button>
            </div>
          ))}

        </div>
      )}
    </Layout>
  );
}