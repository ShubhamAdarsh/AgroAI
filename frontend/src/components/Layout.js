import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // 🔥 NEW

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");   // 🔥 remove role
    localStorage.removeItem("email");  // 🔥 remove email
    navigate("/login");
  };

  // 🔥 Dynamic nav based on role
  const workerNav = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Analyze", path: "/crop" },
    { name: "History", path: "/history" },
    { name: "Profile", path: "/worker-profile" },
  ];

  const landlordNav = [
    { name: "Workers", path: "/landlord-dashboard" }, // 🔥 NEW
  ];

  const navItems = role === "landlord" ? landlordNav : workerNav;

  return (
    <div className="min-h-screen flex flex-col">

      {/* 🌌 NAVBAR */}
      <nav className="backdrop-blur-lg bg-white/5 border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-50">

        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-xl font-bold gradient-text cursor-pointer"
        >
          🌾 AgroAI
        </h1>

        {/* Nav Links */}
        <div className="flex gap-6 items-center text-gray-300">

          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`relative transition ${
                location.pathname === item.path
                  ? "text-green-400"
                  : "hover:text-green-400"
              }`}
            >
              {item.name}

              {/* Active underline */}
              <span
                className={`absolute left-0 bottom-0 h-[2px] bg-green-400 transition-all ${
                  location.pathname === item.path
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          ))}

          {/* Auth Buttons */}
          {token ? (
            <button
              onClick={handleLogout}
              className="px-4 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
            >
              Logout 🚪
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-green-400">
                Login
              </Link>
              <Link to="/signup" className="hover:text-green-400">
                Signup
              </Link>
            </>
          )}

        </div>
      </nav>

      {/* 📦 MAIN CONTENT */}
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        {children}
      </main>

      {/* 🌙 FOOTER */}
      <footer className="text-center text-gray-500 py-4 border-t border-white/10">
        Built with 🧠 + 🌾 + ☕ | AgroAI © 2026
      </footer>

    </div>
  );
}