/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Light theme colors
        light: {
          background: "#f9fafb",
          card: "#ffffff",
          cardAlt: "#f3f4f6",
          text: "#111827",
          textSecondary: "#4b5563",
          textTertiary: "#6b7280",
          border: "#e5e7eb",
        },
        // Dark theme colors (existing colors from the app)
        dark: {
          background: "#111112",
          card: "#202024",
          cardAlt: "#2a2a2e",
          text: "#ffffff",
          textSecondary: "#9ca3af",
          textTertiary: "#6b7280",
          border: "#1f2937",
        },
        // Common colors
        primary: "#8b5cf6",
        primaryLight: "#a78bfa",
        primaryDark: "#7c3aed",
      },
    },
  },
  plugins: [],
};
