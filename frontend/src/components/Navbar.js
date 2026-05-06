<nav className="backdrop-blur-lg bg-white/5 border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-50">

  <h1 className="text-xl font-bold gradient-text">
    🌾 AgroAI
  </h1>

  <div className="flex gap-6 text-gray-300">

    {[
      { name: "Dashboard", path: "/dashboard" },
      { name: "Analyze", path: "/crop" },
      { name: "History", path: "/history" },
      { name: "Profile", path: "/profile" },
      { name: "Settings", path: "/settings" },
    ].map((item) => (
      <Link
        key={item.name}
        to={item.path}
        className="hover:text-green-400 transition relative group"
      >
        {item.name}

        {/* underline animation */}
        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-green-400 transition-all group-hover:w-full"></span>
      </Link>
    ))}

  </div>
</nav>