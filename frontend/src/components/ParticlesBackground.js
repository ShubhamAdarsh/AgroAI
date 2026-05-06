import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticlesBackground() {

  // 🔥 Proper init (stable)
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },

        background: {
          color: "transparent",
        },

        fpsLimit: 60,

        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse", // ✨ reacts to mouse
            },
            resize: true,
          },
          modes: {
            repulse: {
              distance: 80,
              duration: 0.4,
            },
          },
        },

        particles: {
          color: {
            value: ["#22c55e", "#3b82f6"], // 🌈 gradient vibe
          },

          links: {
            enable: true,
            distance: 120,
            color: "#22c55e",
            opacity: 0.2,
            width: 1,
          },

          collisions: {
            enable: false,
          },

          move: {
            enable: true,
            speed: 1,
            direction: "none",
            outModes: {
              default: "out",
            },
          },

          number: {
            value: 60,
            density: {
              enable: true,
              area: 800,
            },
          },

          opacity: {
            value: 0.3,
          },

          shape: {
            type: "circle",
          },

          size: {
            value: { min: 1, max: 3 },
          },
        },

        detectRetina: true,
      }}
      className="absolute top-0 left-0 w-full h-full -z-10"
    />
  );
}