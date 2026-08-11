/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Archivo", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        current: "currentColor",
        transparent: "transparent",

        /* ——— Horizons palette ——— */
        paper: "#FBFAF7",
        ink: {
          DEFAULT: "#111114",
          soft: "#1D1D22",
          deep: "#0E0E12",
        },
        stone: {
          DEFAULT: "#55545C",
          light: "#A3A29F",
        },
        klein: {
          DEFAULT: "#1B33BE",
          deep: "#12238C",
        },
        line: "#E7E4DC",
        surface: "#F1EFE9",

        /* ——— Semantic status, kept distinct from the klein accent ——— */
        success: "#2F6B4F",
        warning: "#B8791F",
        danger: "#A32C22",

        /*
          Legacy TailAdmin aliases, remapped onto the new palette so any
          class that outlives the redesign still renders on-brand.
        */
        white: "#FBFAF7",
        black: "#111114",
        "black-2": "#0E0E12",
        body: "#55545C",
        bodydark: "#A3A29F",
        bodydark1: "#E7E4DC",
        bodydark2: "#A3A29F",
        primary: "#1B33BE",
        secondary: "#F1EFE9",
        stroke: "#E7E4DC",
        gray: "#F1EFE9",
        graydark: "#111114",
        "gray-2": "#F1EFE9",
        "gray-3": "#FBFAF7",
        whiten: "#F1EFE9",
        whiter: "#F5F3EE",
        boxdark: "#FBFAF7",
        "boxdark-2": "#F1EFE9",
        strokedark: "#E7E4DC",
        "form-strokedark": "#E7E4DC",
        "form-input": "#FBFAF7",
        "meta-1": "#A32C22",
        "meta-2": "#F1EFE9",
        "meta-3": "#2F6B4F",
        "meta-4": "#F1EFE9",
        "meta-5": "#1B33BE",
        "meta-6": "#B8791F",
        "meta-7": "#A32C22",
        "meta-8": "#B8791F",
        "meta-9": "#E7E4DC",
      },
      fontSize: {
        "title-xxl": ["44px", "55px"],
        "title-xl": ["36px", "45px"],
        "title-xl2": ["33px", "45px"],
        "title-lg": ["28px", "35px"],
        "title-md": ["24px", "30px"],
        "title-md2": ["26px", "30px"],
        "title-sm": ["20px", "26px"],
        "title-xsm": ["18px", "24px"],
      },
      spacing: {
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.625rem",
        7.5: "1.875rem",
        8.5: "2.125rem",
        9.5: "2.375rem",
        10.5: "2.625rem",
        11: "2.75rem",
        11.5: "2.875rem",
        12.5: "3.125rem",
        13: "3.25rem",
        13.5: "3.375rem",
        14.5: "3.625rem",
        15: "3.75rem",
        15.5: "3.875rem",
        16.5: "4.125rem",
        17: "4.25rem",
        17.5: "4.375rem",
        22.5: "5.625rem",
        27.5: "6.875rem",
        72.5: "18.125rem",
      },
      maxWidth: {
        22.5: "5.625rem",
        42.5: "10.625rem",
        70: "17.5rem",
        90: "22.5rem",
      },
      zIndex: {
        999999: "999999",
        99999: "99999",
        9999: "9999",
        999: "999",
        99: "99",
        9: "9",
        1: "1",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};
