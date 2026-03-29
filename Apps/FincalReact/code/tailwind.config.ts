import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import plugin from "tailwindcss/plugin";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    languages: {
      thai: "th",
      english: "en",
    },
    extend: {
      fontFamily: {
        "bbl": ["BangkokBank-Regular", "system-ui", "sans-serif"],
        "bbl-medium": ["BangkokBank-Medium", "system-ui", "sans-serif"],
        "bbl-bold": ["BangkokBank-Bold", "system-ui", "sans-serif"],
        "bbl-looped": [
          "BangkokBank_Text-Regular",
          "BangkokBank-Regular",
          "system-ui",
          "sans-serif",
        ],
        "bbl-looped-medium": [
          "BangkokBank_Text-Regular Medium",
          "BangkokBank-Medium",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        // These will be replaced by custom utilities for better control
      },
      screens: {
        xs: "0px",
        sm: "376px",
        md: "761px",
        lg: "1025px",
        xl: "1921px",
        "max-lg": { max: "1024px" },
        "max-md": { max: "760px" },
      },
      colors: {
        "gray-50": "#78787D",
        "gray-60": "#F7F7F7",
        "gray-80": "#C8C8CC",
        "gray-90": "#E3E3E5",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    plugin(function ({ addUtilities, theme, addVariant }) {
      addVariant("lang-en", "&:lang(en)");
      addVariant("lang-th", "&:lang(th)");

      const newUtilities = {
        // Desktop D1-medium
        ".font-d1-medium": {
          fontSize: "5.6rem", // 90px
          lineHeight: "1.15", // 104px (EN)
          "&:lang(th)": {
            lineHeight: "1.25", // 113px (TH)
          },
          [`@screen max-lg`]: {
            fontSize: "3.3rem", // 46px
            lineHeight: "1.15", // 53px (EN)
            "&:lang(th)": {
              lineHeight: "1.25", // 58px (TH)
            },
          },
        },
        // Desktop H1-medium
        ".font-h1-medium": {
          fontSize: "4.4rem", // 70px
          lineHeight: "1.15", // 81px (EN)
          "&:lang(th)": {
            lineHeight: "1.25", // 88px (TH)
          },
          [`@screen max-lg`]: {
            fontSize: "2.2rem", // 31px
            lineHeight: "1.15", // 33px (EN)
            "&:lang(th)": {
              lineHeight: "1.25", // 39px (TH)
            },
          },
        },
        // Desktop H2-medium
        ".font-h2-medium": {
          fontSize: "3.9rem", // 62px
          lineHeight: "1.15", // 71px (EN)
          "&:lang(th)": {
            lineHeight: "1.25", // 78px (TH)
          },
          [`@screen max-lg`]: {
            fontSize: "1.9rem", // 26px
            lineHeight: "1.15", // 30px (EN)
            "&:lang(th)": {
              lineHeight: "1.25", // 33px (TH)
            },
          },
        },
        // Desktop H3-medium
        ".font-h3-medium": {
          fontSize: "3rem", // 48px
          lineHeight: "1.15", // 55px (EN)
          "&:lang(th)": {
            lineHeight: "1.25", // 60px (TH)
          },
          [`@screen max-lg`]: {
            fontSize: "1.6rem", // 22px
            lineHeight: "1.35", // 30px (EN)
            "&:lang(th)": {
              lineHeight: "1.35", // 30px (TH)
            },
          },
        },
        // Desktop H4-medium
        ".font-h4-medium": {
          fontSize: "2rem", // 32px
          lineHeight: "1.15", // 37px (EN)
          "&:lang(th)": {
            lineHeight: "1.25", // 40px (TH)
          },
          [`@screen max-lg`]: {
            fontSize: "1.3rem", // 18px
            lineHeight: "1.35", // 24px (EN)
            "&:lang(th)": {
              lineHeight: "1.35", // 24px (TH)
            },
          },
        },
        // Desktop H5-medium
        ".font-h5-medium": {
          fontSize: "1.5rem", // 24px
          lineHeight: "1.35", // 32px (EN)
          "&:lang(th)": {
            lineHeight: "1.35", // 32px (TH)
          },
          [`@screen max-lg`]: {
            fontSize: "1.3rem", // 18px
            lineHeight: "1.35", // 24px (EN)
            "&:lang(th)": {
              lineHeight: "1.35", // 24px (TH)
            },
          },
        },
        // Desktop H5-regular
        ".font-h5-regular": {
          fontSize: "1.5rem", // 24px
          lineHeight: "1.35", // 32px (EN)
          "&:lang(th)": {
            lineHeight: "1.35", // 32px (TH)
          },
          [`@screen max-lg`]: {
            fontSize: "1.3rem", // 18px
            lineHeight: "1.35", // 24px (EN)
            "&:lang(th)": {
              lineHeight: "1.35", // 24px (TH)
            },
          },
        },
        // Default font-size
        ".font-default-size": {
          fontSize: "16px", // 16px
          [`@screen max-lg`]: {
            fontSize: "14px", // 14px
          },
        },
        // Desktop B1-medium
        ".font-b1-medium": {
          fontSize: "1rem", // 16px
          lineHeight: "1.35", // 22px (EN)
          "&:lang(th)": {
            lineHeight: "1.35", // 22px (TH)
          },
          [`@screen max-lg`]: {
            fontSize: "1rem", // 14px
            lineHeight: "1.35", // 19px (EN)
            "&:lang(th)": {
              lineHeight: "1.35", // 19px (TH)
            },
          },
        },
        // Desktop B1-regular
        ".font-b1-regular": {
          fontSize: "1rem", // 16px
          lineHeight: "1.35", // 22px (EN)
          "&:lang(th)": {
            lineHeight: "1.35", // 22px (TH)
          },
          [`@screen max-lg`]: {
            fontSize: "1rem", // 14px
            lineHeight: "1.35", // 19px (EN)
            "&:lang(th)": {
              lineHeight: "1.35", // 19px (TH)
            },
          },
        },
        // Desktop B2-medium
        ".font-b2-medium": {
          fontSize: "0.9rem", // 14px
          lineHeight: "1.35", // 19px (EN)

          "&:lang(th)": {
            lineHeight: "1.35", // 19px (TH)
          },
          [`@screen max-lg`]: {
            fontSize: "0.9rem", // 12px
            lineHeight: "1.35", // 16px (EN)
            "&:lang(th)": {
              lineHeight: "1.35", // 16px (TH)
            },
          },
        },
        // Desktop B2-regular
        ".font-b2-regular": {
          fontSize: "0.9rem", // 14px
          lineHeight: "1.35", // 19px (EN)
          "&:lang(th)": {
            lineHeight: "1.35", // 19px (TH)
          },
          [`@screen max-lg`]: {
            fontSize: "0.9rem", // 12px
            lineHeight: "1.35", // 16px (EN)
            "&:lang(th)": {
              lineHeight: "1.35", // 16px (TH)
            },
          },
        },
        // Desktop B3-medium
        ".font-b3-medium": {
          fontSize: "0.8rem", // 12px
          lineHeight: "1.35", // 16px (EN)
          "&:lang(th)": {
            lineHeight: "1.35", // 16px (TH)
          },
          [`@screen max-lg`]: {
            fontSize: "0.9rem", // 12px
            lineHeight: "1.35", // 15px (EN)
            "&:lang(th)": {
              lineHeight: "1.35", // 15px (TH)
            },
          },
        },
        // Desktop B3-regular
        ".font-b3-regular": {
          fontSize: "0.8rem", // 12px
          lineHeight: "1.35", // 16px (EN)
          "&:lang(th)": {
            lineHeight: "1.35", // 16px (TH)
          },
          [`@screen max-lg`]: {
            fontSize: "0.9rem", // 11px
            lineHeight: "1.35", // 14px (EN)
            "&:lang(th)": {
              lineHeight: "1.35", // 14px (TH)
            },
          },
        },
        // Desktop B4-medium
        ".font-b4-medium": {
          fontSize: "0.6rem", // 10px
          lineHeight: "1.35", // 14px (EN)
          "&:lang(th)": {
            lineHeight: "1.35", // 14px (TH)
          },
          [`@screen max-lg`]: {
            fontSize: "0.7rem", // 10px
            lineHeight: "1.35", // 14px (EN)
            "&:lang(th)": {
              lineHeight: "1.35", // 14px (TH)
            },
          },
        },
        // Desktop B4-regular
        ".font-b4-regular": {
          fontSize: "0.6rem", // 10px
          lineHeight: "1.35", // 14px (EN)
          "&:lang(th)": {
            lineHeight: "1.35", // 14px (TH)
          },
          [`@screen max-lg`]: {
            fontSize: "0.7rem", // 10px
            lineHeight: "1.35", // 14px (EN)
            "&:lang(th)": {
              lineHeight: "1.35", // 14px (TH)
            },
          },
        },
        // Existing custom colors and other utilities, adjusted for the error
        ".gray-50": {
          color: "#78787D",
        },
        ".gray-60": {
          color: "#939399",
        },
        ".gray-80": {
          color: "#C8C8CC",
        },
        ".gray-90": {
          color: "#E3E3E5",
        },
        ".text-unit": {
          fontSize: "0.875rem",
          lineHeight: "1em",
          fontWeight: "100",
        },
        ".text-note": {
          fontSize: "12px",
          color: "#7a7a85ff",
        },
        ".text-green": {
          color: "#2DCD73",
        },
        ".text-gray": {
          color: "#78787D",
        },
        ".text-gray-50": {
          color: "#78787D",
        },
        ".text-gray-60": {
          color: "#939399",
        },
        ".text-gray-80": {
          color: "#C8C8CC",
        },
        ".text-gray-90": {
          color: "#E3E3E5",
        },
        ".text-primary": {
          color: "#0064FF",
        },
        ".text-secondary": {
          color: "#002850",
        },
        ".bg-bbl-gray": {
          background: "#F5F5F5",
        },
        ".bg-secondary": {
          background: "#002850",
          color: " #FFFFFF",
        },
        ".border-gray": {
          border: "1px solid #939399",
        },
        ".border-gray-50": {
          border: "1px solid #78787D",
        },
        ".border-top-gray-50": {
          borderTop: "1px solid #78787D",
        },
        ".border-gray-60": {
          border: "1px solid #939399",
        },
        ".border-top-gray-60": {
          borderTop: "1px solid #939399",
        },
        ".border-gray-80": {
          border: "1px solid #C8C8CC",
        },
        ".border-top-gray-80": {
          borderTop: "1px solid #C8C8CC",
        },
        ".border-gray-90": {
          border: "1px solid #E3E3E5",
        },
        ".border-top-gray-90": {
          borderTop: "1px solid #E3E3E5",
        },
        ".border-primary": {
          border: "1px solid #0064FF",
        },
        ".border-top-primary": {
          borderTop: "1px solid #0064FF",
        },
        ".border-secondary": {
          border: "1px solid #002850",
        },
        ".border-top-secondary": {
          borderTop: "1px solid #002850",
        },
        ".h-separator": {
          height: "auto",
          background: "#C8C8CC",
        },
        ".v-separator": {
          width: "100%",
          background: "#C8C8CC",
        },
        ".bg-gray-50": {
          background: "#78787D",
          border: "1px solid #78787D",
        },
        ".bg-gray-60": {
          background: "#939399",
          border: "1px solid #939399",
        },
        ".bg-gray-80": {
          background: "#C8C8CC",
          border: "1px solid #C8C8CC",
        },
        ".bg-gray-90": {
          background: "#E3E3E5",
          border: "1px solid #E3E3E5",
        },
        ".bg-primary": {
          background: "#0064FF",
          color: " #FFFFFF",
          border: "1px solid #0064FF",
        },
        ".bg-primary-hover": {
          background: "#0048B7",
          color: " #FFFFFF",
          border: "1px solid #0048B7",
        },
        ".bg-outline": {
          background: "#FFFFFF",
          color: " #0064FF",
          border: "1px solid #0064FF",
        },
        ".bg-outline-hover": {
          background: "#0064FF",
          color: " #FFFFFF",
          border: "1px solid #0064FF",
        },
      };
      addUtilities(newUtilities);
    }),
  ],
} satisfies Config;
