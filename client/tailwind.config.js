/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: "#0F0B1E",
          base: "#0F0B1E",
          surface: "#120A22",
          card: "rgba(255, 255, 255, 0.08)",
          cardHover: "rgba(255, 255, 255, 0.12)",
          border: "rgba(255, 255, 255, 0.18)",
          input: "rgba(255, 255, 255, 0.06)",
        },
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          violet: "#7C3AED",
          indigo: "#6366F1",
          magenta: "#EC4899",
          amber: "#FBBF24",
        },
        violet: {
          DEFAULT: "#7C3AED",
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#7C3AED",
          600: "#6d28d9",
          700: "#5b21b6",
          800: "#4c1d95",
          900: "#3b0764",
          indigo: "#6366F1",
        },
        magenta: {
          DEFAULT: "#EC4899",
          400: "#f472b6",
          500: "#EC4899",
          600: "#db2777",
          700: "#be185d",
        },
        amber: {
          DEFAULT: "#FBBF24",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        lavender: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          muted: "#94A3B8",
          darkMuted: "#A5B4FC",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ['"Space Grotesk"', "Inter", "sans-serif"],
      },
      animation: {
        "mesh-drift-1": "drift1 24s ease-in-out infinite alternate",
        "mesh-drift-2": "drift2 28s ease-in-out infinite alternate",
        "mesh-drift-3": "drift3 32s ease-in-out infinite alternate",
        "pulse-glow": "pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2.2s infinite",
        "scale-in": "scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-slide-up": "fadeSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        drift1: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(80px, -60px) scale(1.15)" },
          "100%": { transform: "translate(-50px, 40px) scale(0.9)" },
        },
        drift2: {
          "0%": { transform: "translate(0px, 0px) scale(1.1)" },
          "50%": { transform: "translate(-90px, 70px) scale(0.85)" },
          "100%": { transform: "translate(60px, -40px) scale(1.2)" },
        },
        drift3: {
          "0%": { transform: "translate(0px, 0px) scale(0.95)" },
          "50%": { transform: "translate(70px, 90px) scale(1.2)" },
          "100%": { transform: "translate(-80px, -50px) scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 12px 2px rgba(236, 72, 153, 0.6)",
          },
          "50%": {
            opacity: "0.6",
            boxShadow: "0 0 4px 1px rgba(236, 72, 153, 0.2)",
          },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.94) translateY(8px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        fadeSlideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
