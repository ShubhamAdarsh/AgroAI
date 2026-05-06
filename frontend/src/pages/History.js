import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ReactMarkdown from "react-markdown";

export default function History() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:8000/history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // 🔐 IMPORTANT
          },
        });

        if (!res.ok) {
          throw new Error("Unauthorized or server error");
        }

        const result = await res.json();
        setData(result.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load history 🚨");
      }

      setLoading(false);
    };

    fetchHistory();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl mb-6 gradient-text">History 📜</h1>

      {/* 🔄 LOADING */}
      {loading && (
        <div className="text-gray-400 animate-pulse">
          Loading your history...
        </div>
      )}

      {/* ❌ ERROR */}
      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* 📭 EMPTY */}
      {!loading && data.length === 0 && (
        <div className="text-gray-500">
          No history found yet 🌱
        </div>
      )}

      {/* 📊 DATA */}
      <div className="space-y-6">
        {data.map((item, i) => (
          <div
            key={i}
            className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:scale-[1.02] transition"
          >
            {/* 🌱 INPUT */}
            <p className="text-gray-400 mb-2">
              🌱 <b>Input:</b> {item.task}
            </p>

            {/* 🌾 CROP */}
            <h2 className="text-xl font-bold text-green-400 mb-3">
              🌾 {item.recommended_crop}
            </h2>

            {/* 🧠 REASON (MARKDOWN) */}
            <div className="prose prose-invert max-w-none text-gray-300">
              <ReactMarkdown>
                {item.reason}
              </ReactMarkdown>
            </div>

            {/* 🕒 TIME */}
            {item.created_at && (
              <p className="text-xs text-gray-500 mt-4">
                {new Date(item.created_at).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}