import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
      
      sans: ["var(--font-jakarta)"],      },
      colors: {
        // Design tokens (Horizon / NextAdmin look)
        bg: "hsl(var(--bg))",
        surface: "hsl(var(--surface))",
        surface2: "hsl(var(--surface-2))",
        text: "hsl(var(--text))",
        muted: "hsl(var(--muted))",
        muted2: "hsl(var(--muted-2))",
        border: "hsl(var(--border))",
        brand: {
          DEFAULT: "hsl(var(--brand))",
          2: "hsl(var(--brand-2))",
        },
        success: "hsl(var(--success))",
        danger: "hsl(var(--danger))",
        warn: "hsl(var(--warn))",
      },
      boxShadow: {
        card: "0 18px 40px rgba(0, 0, 0, 0.05)",
        cardSm: "0 10px 24px rgba(0, 0, 0, 0.04)",
        input: "0 8px 18px rgba(0, 0, 0, 0.04)",
      },
      borderRadius: {
        xl2: "20px",
      },
    },
  },
  plugins: [],
} satisfies Config;
