import { useState } from "react";
import Layout from "../components/Layout";
import ReactMarkdown from "react-markdown";

export default function CropAnalysis() {
  const [task, setTask] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRun = async () => {
    if (!task) {
      setError("Please enter farming conditions ⚠️");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("http://localhost:8000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // 🔐 IMPORTANT
        },
        body: JSON.stringify({ task }),
      });

      if (!res.ok) {
        throw new Error("Unauthorized or server error");
      }

      const data = await res.json();

      console.log("API RESULT:", data);

      setResult(data.data); // ✅ correct extraction

    } catch (err) {
      console.error(err);
      setError("Failed to connect to backend 🚨");
    }

    setLoading(false);
  };

  return (
    <Layout>
      <h1 className="text-3xl mb-4">Crop Recommendation 🌾</h1>

      {/* INPUT */}
      <textarea
        className="w-full p-4 rounded text-black"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter soil, weather..."
      />

      {/* BUTTON */}
      <button
        onClick={handleRun}
        disabled={loading}
        className={`mt-4 px-6 py-2 rounded-xl transition ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {loading ? "Thinking... 🤖" : "Analyze 🚀"}
      </button>

      {/* ERROR */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/20 text-red-400 rounded">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="mt-10 flex flex-col items-center justify-center text-center animate-fadeIn">
          <div className="text-6xl float">
            🤖
          </div>
          <div className="mt-4 text-lg text-gray-300">
            AI is thinking<span className="dots"></span>
          </div>
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="mt-6 grid grid-cols-1 gap-4 animate-fadeIn">

          {/* 🌾 CROP */}
          <div className="bg-green-700 p-4 rounded-xl transform hover:scale-105 hover:shadow-2xl transition duration-300">
            <h2 className="text-lg opacity-80 mb-2">
              🌾 Recommended Crop
            </h2>
            <h1 className="text-4xl font-extrabold tracking-wide">
              {result.crop?.replace(/[\{\}"']/g, "").split(",")[0]}
            </h1>
          </div>

          {/* 🧠 ANALYSIS */}
          <div className="bg-gray-800 p-4 rounded-xl transform hover:scale-105 hover:shadow-xl transition duration-300">
            <h2 className="text-xl font-bold mb-4">
              🧠 Analysis
            </h2>

            <div className="prose prose-invert max-w-none text-gray-300">
              <ReactMarkdown>
                {result.reason}
              </ReactMarkdown>
            </div>
          </div>

        </div>
      )}
    </Layout>
  );
}