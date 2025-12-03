const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...fontFamily.sans],
      },
      borderRadius: {
        DEFAULT: "8px",
        secondary: "4px",
        container: "12px",
      },
      boxShadow: {
        DEFAULT: "0 1px 4px rgba(0, 0, 0, 0.1)",
        hover: "0 2px 8px rgba(0, 0, 0, 0.12)",
      },
      colors: {
        white: "#FFFFFF",
        gray: {
          DEFAULT: "#2D3748",
          light: "#E2E8F0",
          lighter: "#F7FAFC",
        },
        blue: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          light: "#DBEAFE",
        },
        // Mantendo compatibilidade com nomes antigos
        primary: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
        },
        secondary: {
          DEFAULT: "#2D3748",
          hover: "#1A202C",
        },
      },
      spacing: {
        "form-field": "16px",
        section: "32px",
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ["hover", "active"],
    },
  },
};
