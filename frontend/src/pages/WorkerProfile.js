import { useState } from "react";
import Layout from "../components/Layout";

export default function WorkerProfile() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    try {
        const res = await fetch("http://localhost:8000/worker-profile", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // 🔐 REQUIRED
        },
        body: JSON.stringify({
            name,
            location,
            skills: skills.split(",").map((s) => s.trim()),
        }),
        });

        if (!res.ok) {
        throw new Error("Failed to save profile");
        }

        const data = await res.json();
        setMessage(data.message || "Saved ✅");

    } catch (err) {
        console.error(err);
        setMessage("Server not reachable 🚨");
    }
};

  return (
    <Layout>
      <h1 className="text-3xl mb-6 gradient-text">
        Worker Profile 👨‍🌾
      </h1>

      <div className="glass p-6 max-w-xl">

        <input
          className="input-box mb-4"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input-box mb-4"
          placeholder="Location"
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          className="input-box mb-4"
          placeholder="Skills (comma separated)"
          onChange={(e) => setSkills(e.target.value)}
        />

        <button
          onClick={handleSave}
          className="button-primary w-full"
        >
          Save Profile 💾
        </button>

        {message && (
          <p className="mt-4 text-green-400">{message}</p>
        )}

      </div>
    </Layout>
  );
}