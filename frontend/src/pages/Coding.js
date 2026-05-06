import { useState } from "react";
import Layout from "../components/Layout";

export default function Coding() {
  const [task, setTask] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    if (!task) return;

    setLoading(true);
    setOutput("");

    try {
      const res = await fetch("http://127.0.0.1:8000/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task, usecase: "2" }),
      });

      const data = await res.json();
      setOutput(data.output);
    } catch (err) {
      setOutput("Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <Layout>
      <h1 className="text-3xl mb-4">Coding Assistant 💻</h1>

      <textarea
        className="w-full p-4 rounded text-black"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Ask coding question..."
      />

      <button
        onClick={handleRun}
        disabled={loading}
        className={`mt-4 px-6 py-2 rounded-xl ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Thinking... 🤖" : "Generate Code ⚡"}
      </button>

      {loading && (
        <div className="mt-6 p-4 bg-yellow-400 text-black rounded-xl animate-pulse">
          AI is generating code... ⚡🤖
        </div>
      )}

      {output && (
        <div className="mt-6 bg-gray-800 p-4 rounded-xl whitespace-pre-line">
          {output}
        </div>
      )}
    </Layout>
  );
}