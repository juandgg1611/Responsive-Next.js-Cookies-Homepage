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
      // ===== PALETA DE COLORES =====
      colors: {
        // Fondos y Textos (Conectados a variables CSS)
        background: {
          DEFAULT: "rgb(var(--background) / <alpha-value>)",
          light: "rgb(var(--background-light) / <alpha-value>)",
          surface: "rgb(var(--background-surface) / <alpha-value>)",
          dark: "#1A0F0A", // Reserva fija por si acaso
        },
        foreground: "rgb(var(--foreground) / <alpha-value>)",

        text: {
          primary: "rgb(var(--foreground) / <alpha-value>)",
          secondary: "rgb(var(--cookie-primary) / <alpha-value>)", // Dorado de marca
          muted: "rgb(var(--text-muted) / <alpha-value>)",
          inverted: "rgb(var(--background) / <alpha-value>)",
        },

        border: {
          light: "rgba(var(--border-color), 0.3)",
          DEFAULT: "rgb(var(--border-color) / <alpha-value>)",
          dark: "rgba(var(--border-color), 0.8)",
          glow: "rgba(var(--cookie-primary), 0.5)",
        },

        // --- COLORES DE MARCA DINÁMICOS ---
        // Aquí está el cambio clave: Usan RGB variables en lugar de HEX fijos
        cookie: {
          50: "rgb(var(--cookie-primary) / 0.1)",
          100: "rgb(var(--cookie-primary) / 0.2)",
          200: "rgb(var(--cookie-primary) / 0.4)",
          300: "rgb(var(--cookie-primary) / 0.6)",
          400: "rgb(var(--cookie-primary) / 0.8)",
          500: "rgb(var(--cookie-primary) / 1)",    // Color Principal
          600: "rgb(var(--caramel) / 1)",           // Hover
          700: "#854e00", // Fijo para contrastes fuertes si se requiere
          800: "#50412D",
          900: "#242016",
          DEFAULT: "rgb(var(--cookie-primary) / <alpha-value>)",
        },

        chocolate: {
          50: "rgb(var(--chocolate-primary) / 0.1)",
          100: "rgb(var(--chocolate-primary) / 0.2)",
          200: "rgb(var(--chocolate-primary) / 0.4)",
          300: "rgb(var(--chocolate-primary) / 0.6)",
          400: "rgb(var(--chocolate-primary) / 0.8)",
          500: "rgb(var(--chocolate-primary) / 1)", // Color Secundario
          600: "#6F3710",
          700: "#53290C",
          800: "#371C08",
          900: "#1B0E04",
          DEFAULT: "rgb(var(--chocolate-primary) / <alpha-value>)",
        },

        // Mapeos adicionales para compatibilidad
        vanilla: {
          DEFAULT: "rgb(var(--background-light) / <alpha-value>)",
        },
        caramel: {
          DEFAULT: "rgb(var(--caramel) / <alpha-value>)",
        },
        
        // Estados
        state: {
          hover: "rgb(var(--cookie-primary) / 0.15)",
          active: "rgb(var(--chocolate-primary) / 0.25)",
          disabled: "rgba(166, 124, 82, 0.3)",
          success: "#10B981",
          error: "#EF4444",
          warning: "#F59E0B",
        },
      },

      // ... Resto de la configuración (Fuentes, Animaciones, Tamaños) se queda igual ...
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
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float-delayed 7s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "cookie-spin": "cookie-spin 20s linear infinite",
        "cookie-spin-slow": "cookie-spin 30s linear infinite",
        "cookie-bake": "bake-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "chocolate-fall": "chocolate-chip-fall 3s linear infinite",
        "chocolate-fall-slow": "chocolate-chip-fall 5s linear infinite",
        "price-drop": "price-drop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
        "pulse-soft": "pulse-soft 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-glow": "pulse-soft 2s ease-in-out infinite",
        shimmer: "shimmer 2s infinite linear",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "slide-in-up": "slide-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "slide-in-right": "slide-in-right 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "slide-in-left": "slide-in-right 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "confetti-fall": "confetti-fall 5s linear forwards",
        "coupon-unfold": "coupon-unfold 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
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

      // ===== FONDOS (ACTUALIZADO) =====
      backgroundImage: {
        "cookie-texture": "url('/images/textures/cookie-bg.png')",
        // Gradientes conectados a variables
        "gradient-cookie": "linear-gradient(135deg, rgb(var(--cookie-primary)) 0%, rgb(var(--caramel)) 100%)",
        "gradient-chocolate": "linear-gradient(135deg, rgb(var(--chocolate-primary)) 0%, #5D2906 100%)",
        "gradient-caramel": "linear-gradient(135deg, rgb(var(--caramel)) 0%, rgb(var(--cookie-primary)) 100%)",
        "gradient-vanilla": "linear-gradient(135deg, rgb(var(--background-light)) 0%, rgb(var(--background-surface)) 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-baked": "linear-gradient(145deg, #3A2318 0%, #2C1A12 100%)",
        "gradient-glow": "linear-gradient(90deg, transparent, rgb(var(--cookie-primary) / 0.1), transparent)",
        "gradient-shimmer": "linear-gradient(90deg, transparent 0%, rgb(var(--cookie-primary) / 0.1) 50%, transparent 100%)",
      },
      backgroundSize: {
        "200%": "200%",
        "300%": "300%",
      },

      // ===== SOMBRAS (ACTUALIZADO) =====
      boxShadow: {
        // Neumorfismo dinámico
        neumorphic: "20px 20px 60px rgb(var(--chocolate-primary) / 0.15), -20px -20px 60px rgb(var(--background-light) / 0.5)",
        "neumorphic-sm": "10px 10px 30px rgb(var(--chocolate-primary) / 0.1), -10px -10px 30px rgb(var(--background-light) / 0.5)",
        "neumorphic-lg": "30px 30px 90px rgb(var(--chocolate-primary) / 0.2), -30px -30px 90px rgb(var(--background-light) / 0.5)",
        "neumorphic-inset": "inset 20px 20px 60px rgb(var(--chocolate-primary) / 0.1), inset -20px -20px 60px rgb(var(--background-light) / 0.5)",
        "neumorphic-inset-sm": "inset 10px 10px 30px rgb(var(--chocolate-primary) / 0.1), inset -10px -10px 30px rgb(var(--background-light) / 0.5)",

        // Sombras con color de marca
        cookie: "0 10px 40px -10px rgb(var(--chocolate-primary) / 0.3)",
        "cookie-lg": "0 20px 60px -15px rgb(var(--chocolate-primary) / 0.4)",
        "cookie-xl": "0 25px 80px -20px rgb(var(--chocolate-primary) / 0.5)",
        
        floating: "0 25px 50px -12px rgb(var(--chocolate-primary) / 0.15)",
        "floating-lg": "0 35px 70px -15px rgb(var(--chocolate-primary) / 0.2)",

        glow: "0 0 30px rgb(var(--cookie-primary) / 0.4)",
        "glow-lg": "0 0 50px rgb(var(--cookie-primary) / 0.6)",
        "glow-chocolate": "0 0 30px rgb(var(--chocolate-primary) / 0.4)",

        "text-glow": "0 0 10px rgb(var(--cookie-primary) / 0.5)",

        hover: "0 20px 40px rgb(var(--chocolate-primary) / 0.15)",
        active: "0 10px 20px rgb(var(--chocolate-primary) / 0.2)",
        
        modal: "0 50px 100px -20px rgba(0, 0, 0, 0.5)",
      },

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
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
        transform: "transform",
        shadow: "box-shadow",
        colors: "color, background-color, border-color, text-decoration-color, fill, stroke",
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

  // ===== PLUGINS (ACTUALIZADOS A VARIABLES) =====
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    function ({ addUtilities, theme }) {
      const newUtilities = {
        ".texture-cookie": {
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(var(--texture-dot), 0.05) 2%, transparent 2.5%),
                          radial-gradient(circle at 75% 75%, rgba(var(--texture-dot), 0.05) 2%, transparent 2.5%)`,
          backgroundSize: "60px 60px",
        },
        ".glass-cookie": {
          background: "rgb(var(--background-surface) / 0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgb(var(--border-color) / 0.3)",
        },
        ".text-gradient-cookie": {
          background: "linear-gradient(135deg, rgb(var(--cookie-primary)) 0%, rgb(var(--caramel)) 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        },
        ".cookie-card-3d": {
          background: "linear-gradient(145deg, rgb(var(--background-light)), rgb(var(--background-surface)))",
          borderRadius: "30px",
          boxShadow:
            "20px 20px 60px rgb(var(--chocolate-primary) / 0.1), -20px -20px 60px rgb(var(--background-light) / 0.8), inset 0 0 0 1px rgb(var(--cookie-primary) / 0.1)",
        },
        ".perspective-1000": {
          perspective: "1000px",
        },
        ".transform-style-3d": {
          transformStyle: "preserve-3d",
        },
        ".backface-hidden": {
          backfaceVisibility: "hidden",
        },
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
          background:
            "linear-gradient(90deg, transparent, rgb(var(--cookie-primary) / 0.2), transparent)",
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
            background: "linear-gradient(135deg, rgb(var(--cookie-primary)) 0%, rgb(var(--caramel)) 100%)",
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
            background: "rgba(255, 255, 255, 0.2)",
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
            boxShadow: theme("boxShadow.cookie-lg"),
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
          backgroundColor: "rgb(var(--background-surface) / 0.5)",
          border: `2px solid ${theme("colors.border.light")}`,
          borderRadius: theme("borderRadius.cookie"),
          padding: `${theme("spacing.4")} ${theme("spacing.6")}`,
          color: theme("colors.text.primary"),
          fontSize: theme("fontSize.cookie-base"),
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          width: "100%",
          "&:focus": {
            outline: "none",
            borderColor: "rgb(var(--cookie-primary))",
            boxShadow: `0 0 0 3px rgb(var(--cookie-primary) / 0.2)`,
          },
          "&::placeholder": {
            color: theme("colors.text.muted"),
          },
        },
      };
      addComponents(components);
    },
  ],
};