import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("worker"); // 🔥 NEW
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill all fields ⚠️");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password, role }) // 🔥 SEND ROLE
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role); // 🔥 SAVE ROLE
        localStorage.setItem("email", email);

        // 🎯 REDIRECT BASED ON ROLE
        if (data.role === "landlord") {
          navigate("/landlord-dashboard");
        } else {
          navigate("/");
        }

        window.location.reload();
      } else {
        setError(data.detail || "Signup failed ❌");
      }

    } catch (err) {
      setError("Server not reachable 🚨");
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex justify-center items-center">

        <div className="glass p-8 w-[380px] text-center">

          <h1 className="text-3xl gradient-text mb-6">
            Create Account ✨
          </h1>

          {/* ERROR */}
          {error && (
            <div className="mb-4 p-2 bg-red-500/20 text-red-400 rounded">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <input
            className="input-box mb-4"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <input
            type="password"
            className="input-box mb-4"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          {/* 🔥 ROLE SELECT */}
          <select
            className="input-box mb-4"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="worker">👨‍🌾 Worker</option>
            <option value="landlord">🧑‍💼 Landlord</option>
          </select>

          {/* BUTTON */}
          <button onClick={handleSignup} className="button-primary w-full">
            Signup 🚀
          </button>

          {/* LOGIN LINK */}
          <p className="mt-4 text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-green-400 hover:underline">
              Login
            </Link>
          </p>

        </div>

      </div>
    </Layout>
  );
}