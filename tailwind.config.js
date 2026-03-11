/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // ===== PALETA DE COLORES COMPLETA =====
      colors: {
        // Color principal: Galleta horneada (FIJOS - color de marca)
        cookie: {
          50: "#FDF6E9",
          100: "#FAEDD3",
          200: "#F5DBA7",
          300: "#F0C97B",
          400: "#EBB74F",
          500: "#D4A574",
          600: "#A8835C",
          700: "#7C6245",
          800: "#50412D",
          900: "#242016",
        },
        // Color de acento: Chocolate oscuro (FIJOS - color de marca)
        chocolate: {
          50: "#F5EFE6",
          100: "#EBDFCD",
          200: "#D7BF9B",
          300: "#C39F69",
          400: "#AF7F37",
          500: "#8B4513",
          600: "#6F3710",
          700: "#53290C",
          800: "#371C08",
          900: "#1B0E04",
        },

        // ── COLORES SEMÁNTICOS (responden al tema) ──────────────────────

        // Fondo principal
        background: {
          DEFAULT: "rgb(var(--background))",
          light: "rgb(var(--background-light))",
          dark: "rgb(var(--background-dark))",
          surface: "rgb(var(--background-surface))",
        },

        // Colores secundarios semánticos
        vanilla: {
          DEFAULT: "rgb(var(--foreground))",
          light: "rgb(var(--foreground))",
          dark: "rgb(var(--text-secondary))",
        },
        caramel: {
          DEFAULT: "rgb(var(--text-muted))",
          light: "rgb(var(--text-secondary))",
          dark: "rgb(var(--text-muted))",
        },

        // Butter y Honey (FIJOS - decorativos de marca)
        butter: {
          DEFAULT: "#FFD8A6",
          light: "#FFE8CC",
          dark: "#EFC896",
        },
        honey: {
          DEFAULT: "#D9A565",
          light: "#E8BD84",
          dark: "#C99555",
        },

        // Colores de texto
        text: {
          primary: "rgb(var(--text-primary))",
          secondary: "rgb(var(--text-secondary))",
          muted: "rgb(var(--text-muted))",
          inverted: "rgb(var(--background))",
        },

        // Estados
        state: {
          hover: "var(--state-hover)",
          active: "var(--state-active)",
          disabled: "var(--state-disabled)",
          success: "#10B981",
          error: "#EF4444",
          warning: "#F59E0B",
        },

        // Bordes
        border: {
          light: "rgba(var(--border-light-rgb), var(--border-light-alpha))",
          dark: "rgba(var(--border-dark-rgb), var(--border-dark-alpha))",
          glow: "rgba(var(--cookie-primary), 0.5)",
        },
      },

      // ===== TIPOGRAFÍA =====
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        handwritten: ['"Dancing Script"', "cursive"],
      },
      fontSize: {
        "cookie-xs": "0.75rem",
        "cookie-sm": "0.875rem",
        "cookie-base": "1rem",
        "cookie-lg": "1.125rem",
        "cookie-xl": "1.25rem",
        "cookie-2xl": "1.5rem",
        "cookie-3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "cookie-4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "cookie-5xl": ["3rem", { lineHeight: "1" }],
        "cookie-6xl": ["3.75rem", { lineHeight: "1" }],
        "cookie-7xl": ["4.5rem", { lineHeight: "1" }],
        "cookie-8xl": ["6rem", { lineHeight: "1" }],
        "cookie-9xl": ["8rem", { lineHeight: "1" }],
      },
      fontWeight: {
        cookie: "400",
        "cookie-medium": "500",
        "cookie-semibold": "600",
        "cookie-bold": "700",
        "cookie-extrabold": "800",
        "cookie-black": "900",
      },

      // ===== ANIMACIONES PERSONALIZADAS =====
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float-delayed 7s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "cookie-spin": "cookie-spin 20s linear infinite",
        "cookie-spin-slow": "cookie-spin 30s linear infinite",
        "cookie-bake": "bake-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "chocolate-fall": "chocolate-chip-fall 3s linear infinite",
        "chocolate-fall-slow": "chocolate-chip-fall 5s linear infinite",
        "price-drop":
          "price-drop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
        "pulse-soft": "pulse-soft 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-glow": "pulse-soft 2s ease-in-out infinite",
        shimmer: "shimmer 2s infinite linear",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "slide-in-up": "slide-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "slide-in-right":
          "slide-in-right 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "slide-in-left":
          "slide-in-right 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "confetti-fall": "confetti-fall 5s linear forwards",
        "coupon-unfold":
          "coupon-unfold 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
        "hover-lift": "hover-lift 0.3s ease forwards",
        "hover-sink": "hover-sink 0.3s ease forwards",
      },
      animationDelay: {
        0: "0ms",
        100: "100ms",
        200: "200ms",
        300: "300ms",
        400: "400ms",
        500: "500ms",
        1000: "1000ms",
        2000: "2000ms",
      },
      animationDuration: {
        0: "0ms",
        500: "500ms",
        1000: "1000ms",
        2000: "2000ms",
        3000: "3000ms",
        5000: "5000ms",
        10000: "10000ms",
      },
      animationTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        slow: "cubic-bezier(0.77, 0, 0.175, 1)",
      },

      // ===== FONDOS =====
      backgroundImage: {
        "cookie-texture": "url('/images/textures/cookie-bg.png')",
        "cookie-texture-light": "url('/images/textures/cookie-bg-light.png')",
        "chocolate-chip": "url('/images/textures/chocolate-chip.png')",
        "gradient-cookie": "linear-gradient(135deg, #D4A574 0%, #A67C52 100%)",
        "gradient-chocolate":
          "linear-gradient(135deg, #8B4513 0%, #5D2906 100%)",
        "gradient-caramel": "linear-gradient(135deg, #A67C52 0%, #C9A37D 100%)",
        "gradient-vanilla": "linear-gradient(135deg, #F5E9D9 0%, #E5D9C9 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-baked":
          "linear-gradient(145deg, var(--gradient-baked-from) 0%, var(--gradient-baked-to) 100%)",
        "gradient-glow":
          "linear-gradient(90deg, transparent, var(--gradient-glow-color), transparent)",
        "gradient-shimmer":
          "linear-gradient(90deg, transparent 0%, var(--gradient-shimmer-color) 50%, transparent 100%)",
      },
      backgroundSize: {
        "200%": "200%",
        "300%": "300%",
      },

      // ===== SOMBRAS =====
      boxShadow: {
        // Neumorfismo (ahora con variables)
        neumorphic: "var(--neumorphic)",
        "neumorphic-sm": "var(--neumorphic-sm)",
        "neumorphic-lg": "var(--neumorphic-lg)",
        "neumorphic-inset": "var(--neumorphic-inset)",
        "neumorphic-inset-sm": "var(--neumorphic-inset-sm)",

        // Sombras flotantes (ahora con variables)
        cookie: "var(--shadow-cookie)",
        "cookie-lg": "var(--shadow-cookie-lg)",
        "cookie-xl": "var(--shadow-cookie-xl)",
        floating: "var(--shadow-floating)",
        "floating-lg": "var(--shadow-floating-lg)",

        // Efectos de brillo
        glow: "var(--shadow-glow)",
        "glow-lg": "var(--shadow-glow-lg)",
        "glow-chocolate": "var(--shadow-glow-chocolate)",

        // Sombras de texto
        "text-glow": "0 0 10px rgba(var(--cookie-primary), 0.5)",

        // Sombras interactivas
        hover: "var(--shadow-hover)",
        active: "var(--shadow-active)",

        // Sombras para modales
        modal: "var(--shadow-modal)",
      },

      // ===== BORDES Y RADIOS =====
      borderRadius: {
        "cookie-sm": "12px",
        cookie: "20px",
        "cookie-lg": "30px",
        "cookie-xl": "40px",
        "cookie-full": "9999px",
      },
      borderWidth: {
        3: "3px",
        5: "5px",
        6: "6px",
      },

      // ===== ESPACIADO Y TAMAÑOS =====
      spacing: {
        18: "4.5rem",
        88: "22rem",
        100: "25rem",
        112: "28rem",
        128: "32rem",
        144: "36rem",
        160: "40rem",
      },
      maxWidth: {
        "cookie-xs": "20rem",
        "cookie-sm": "24rem",
        "cookie-md": "28rem",
        "cookie-lg": "32rem",
        "cookie-xl": "36rem",
        "cookie-2xl": "42rem",
        "cookie-3xl": "48rem",
        "cookie-4xl": "56rem",
        "cookie-5xl": "64rem",
        "cookie-6xl": "72rem",
        "cookie-7xl": "80rem",
      },
      minHeight: {
        "cookie-section": "500px",
        "cookie-hero": "600px",
        "cookie-card": "300px",
      },
      height: {
        "cookie-sm": "300px",
        "cookie-md": "400px",
        "cookie-lg": "500px",
        "cookie-xl": "600px",
      },
      width: {
        "cookie-sm": "300px",
        "cookie-md": "400px",
        "cookie-lg": "500px",
        "cookie-xl": "600px",
      },

      // ===== EFECTOS VISUALES =====
      backdropBlur: {
        cookie: "20px",
        "cookie-lg": "40px",
        "cookie-xl": "60px",
      },
      blur: {
        cookie: "20px",
        "cookie-lg": "40px",
      },
      opacity: {
        15: "0.15",
        35: "0.35",
        65: "0.65",
        85: "0.85",
      },

      // ===== TRANSFORMACIONES =====
      scale: {
        102: "1.02",
        105: "1.05",
        110: "1.1",
        120: "1.2",
      },
      rotate: {
        17: "17deg",
        22: "22deg",
        30: "30deg",
        45: "45deg",
        60: "60deg",
      },
      translate: {
        "1/7": "14.2857143%",
        "2/7": "28.5714286%",
        "3/7": "42.8571429%",
        "4/7": "57.1428571%",
        "5/7": "71.4285714%",
        "6/7": "85.7142857%",
      },

      // ===== GRID Y FLEXBOX =====
      gridTemplateColumns: {
        cookie: "repeat(auto-fit, minmax(280px, 1fr))",
        "cookie-lg": "repeat(auto-fit, minmax(320px, 1fr))",
        "cookie-products": "repeat(auto-fill, minmax(300px, 1fr))",
        "cookie-features": "repeat(auto-fit, minmax(250px, 1fr))",
        "cookie-testimonials": "repeat(auto-fit, minmax(350px, 1fr))",
      },
      gridAutoRows: {
        cookie: "minmax(200px, auto)",
        "cookie-lg": "minmax(300px, auto)",
      },

      // ===== Z-INDEX =====
      zIndex: {
        "cookie-under": "-1",
        "cookie-base": "1",
        "cookie-over": "10",
        "cookie-sticky": "50",
        "cookie-dropdown": "100",
        "cookie-sticky-nav": "150",
        "cookie-modal": "200",
        "cookie-popover": "250",
        "cookie-tooltip": "300",
        "cookie-toast": "400",
        "cookie-overlay": "500",
        "cookie-max": "999",
      },

      // ===== TRANSICIONES =====
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
        transform: "transform",
        shadow: "box-shadow",
        colors:
          "color, background-color, border-color, text-decoration-color, fill, stroke",
        "all-custom": "all",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
        1200: "1200ms",
        2000: "2000ms",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        slow: "cubic-bezier(0.77, 0, 0.175, 1)",
        snappy: "cubic-bezier(0.87, 0, 0.13, 1)",
      },
      transitionDelay: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
        1000: "1000ms",
      },
    },
  },

  // ===== PLUGINS =====
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    function ({ addUtilities }) {
      const newUtilities = {
        // Textura de galleta
        ".texture-cookie": {
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(var(--chocolate-primary), var(--texture-opacity)) 2%, transparent 2.5%),
                          radial-gradient(circle at 75% 75%, rgba(var(--chocolate-primary), var(--texture-opacity)) 2%, transparent 2.5%)`,
          backgroundSize: "60px 60px",
        },
        // Efecto vidrio esmerilado
        ".glass-cookie": {
          background: "var(--glass-bg)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--glass-border)",
        },
        // Gradiente de texto animado
        ".text-gradient-cookie": {
          background:
            "linear-gradient(135deg, var(--text-gradient-from) 0%, var(--text-gradient-to) 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        },
        // Neumorfismo completo
        ".cookie-card-3d": {
          background: `linear-gradient(145deg, var(--card-3d-from), var(--card-3d-to))`,
          borderRadius: "30px",
          boxShadow: "var(--card-3d-shadow)",
        },
        // Flip 3D
        ".perspective-1000": {
          perspective: "1000px",
        },
        ".transform-style-3d": {
          transformStyle: "preserve-3d",
        },
        ".backface-hidden": {
          backfaceVisibility: "hidden",
        },
        // Loader de horneado
        ".loading-bake": {
          position: "relative",
          overflow: "hidden",
        },
        ".loading-bake::after": {
          content: '""',
          position: "absolute",
          top: "0",
          left: "-100%",
          width: "100%",
          height: "100%",
          background: `linear-gradient(90deg, transparent, var(--shimmer-color), transparent)`,
          animation: "shimmer 2s infinite",
        },
      };
      addUtilities(newUtilities);
    },
    function ({ addComponents, theme }) {
      const components = {
        ".cookie-btn": {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: `${theme("spacing.3")} ${theme("spacing.8")}`,
          borderRadius: theme("borderRadius.cookie-full"),
          fontWeight: theme("fontWeight.cookie-semibold"),
          fontSize: theme("fontSize.cookie-base"),
          textDecoration: "none",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          border: "none",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #D4A574 0%, #8B4513 100%)",
            zIndex: "-1",
            transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "0",
            height: "0",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            transform: "translate(-50%, -50%)",
            transition:
              "width 0.6s cubic-bezier(0.4, 0, 0.2, 1), height 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: "-1",
          },
          "&:hover::after": {
            width: "300px",
            height: "300px",
          },
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "var(--shadow-cookie-lg)",
          },
        },
        ".cookie-badge": {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: `${theme("spacing.1")} ${theme("spacing.3")}`,
          borderRadius: theme("borderRadius.cookie-full"),
          fontSize: theme("fontSize.cookie-xs"),
          fontWeight: theme("fontWeight.cookie-bold"),
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          animation: "pulse-soft 2s ease-in-out infinite",
        },
        ".cookie-input": {
          backgroundColor: "var(--input-bg)",
          border: `2px solid rgba(var(--border-light-rgb), var(--border-light-alpha))`,
          borderRadius: theme("borderRadius.cookie"),
          padding: `${theme("spacing.4")} ${theme("spacing.6")}`,
          color: "rgb(var(--text-primary))",
          fontSize: theme("fontSize.cookie-base"),
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          width: "100%",
          "&:focus": {
            outline: "none",
            borderColor: theme("colors.cookie.500"),
            boxShadow: `0 0 0 3px rgba(var(--cookie-primary), 0.1)`,
          },
          "&::placeholder": {
            color: "rgb(var(--text-muted))",
          },
        },
      };
      addComponents(components);
    },
  ],
};
