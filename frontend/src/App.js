import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CropAnalysis from "./pages/CropAnalysis";
import History from "./pages/History";
import Profile from "./pages/Profile";
import LandlordDashboard from "./pages/LandlordDashboard";
import WorkerProfile from "./pages/WorkerProfile";

function App() {

  const isAuth = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/crop" element={isAuth ? <CropAnalysis /> : <Navigate to="/login" />} />
        <Route path="/history" element={isAuth ? <History /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuth ? <Profile /> : <Navigate to="/login" />} />
        <Route
          path="/landlord-dashboard"
           element={isAuth ? <LandlordDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/worker-profile"
          element={isAuth ? <WorkerProfile /> : <Navigate to="/login" />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;