import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 p-6 min-h-screen">
      <h2 className="text-xl font-bold text-green-400 mb-6">
        AI Multi Model 🚀
      </h2>

      <ul className="space-y-4">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/crop">🌾 Crop</Link></li>
        <li><Link to="/coding">💻 Coding</Link></li>
        <li><Link to="/research">📚 Research</Link></li>
        <li><Link to="/history">📜 History</Link></li>
        <li><Link to="/profile">👤 Profile</Link></li>
      </ul>
    </div>
  );
}