/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure it scans TypeScript files
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          100: "#ebf8ff",
          600: "#3182ce",
        },
        green: {
          100: "#f0fff4",
        },
      },
    },
  },
  plugins: [],
};

