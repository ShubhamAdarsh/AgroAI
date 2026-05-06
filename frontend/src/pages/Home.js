import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import ParticlesBackground from "../components/ParticlesBackground";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));
  }, []);

  return (
    <Layout>
      <div className="text-white overflow-x-hidden">

        <ParticlesBackground />

        {/* 🌟 HERO */}
        <div className="flex flex-col items-center justify-center h-[80vh] text-center px-6">

          <h1 className="text-6xl font-bold mb-6 gradient-text animate-pulse glow">
            Smart Crop AI 🌾
          </h1>

          <p className="text-gray-400 max-w-xl mb-8 text-lg">
            AI-powered farming assistant that analyzes soil, weather, and market trends to recommend the best crops.
          </p>

          <button
            onClick={() => {
              const token = localStorage.getItem("token");
              if (token) {
                navigate("/crop");
              } else {
                navigate("/login");
              }
            }}
            className="button-primary px-8 py-3 text-lg transform hover:scale-110 hover:shadow-2xl"
          >
            Start Analysis 🚀
          </button>

        </div>

        {/* 🌟 FEATURES */}
        <div className="py-20 px-6 grid md:grid-cols-3 gap-8">

          <div className="glass fade-in p-6 hover:scale-105 transition">
            <h2 className="text-xl font-bold mb-2">🌱 Smart Analysis</h2>
            <p className="text-gray-400">
              AI agents analyze soil, weather, and market conditions.
            </p>
          </div>

          <div className="glass fade-in p-6 hover:scale-105 transition">
            <h2 className="text-xl font-bold mb-2">📊 Insights</h2>
            <p className="text-gray-400">
              Visual dashboards help you understand trends and patterns.
            </p>
          </div>

          <div className="glass fade-in p-6 hover:scale-105 transition">
            <h2 className="text-xl font-bold mb-2">⚡ Fast Decisions</h2>
            <p className="text-gray-400">
              Get instant crop recommendations powered by AI.
            </p>
          </div>

        </div>

        {/* 🌟 CTA */}
        <div className="py-20 text-center fade-in">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Farming? 🌍
          </h2>

          <button
            onClick={() => navigate("/crop")}
            className="button-primary px-10 py-4 text-lg"
          >
            Try Now 🚀
          </button>
        </div>

      </div>
    </Layout>
  );
}