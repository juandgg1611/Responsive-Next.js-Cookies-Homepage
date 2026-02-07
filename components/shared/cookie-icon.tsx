"use client";

import { LucideProps } from "lucide-react";

type CookieVariant =
  | "chocolateChip"
  | "sugar"
  | "gingerbread"
  | "macaron"
  | "fortune"
  | "oreo"
  | "classic";

interface CookieIconProps extends Omit<LucideProps, "ref"> {
  variant?: CookieVariant;
  animated?: boolean;
}

const CookieIcon = ({
  variant = "chocolateChip",
  animated = false,
  className = "",
  size = 24,
  ...props
}: CookieIconProps) => {
  const baseClasses = `text-cookie-brown ${animated ? "animate-spin-cookie" : ""} ${className}`;

  // SVG para cada variante de galleta
  const renderCookie = () => {
    switch (variant) {
      case "chocolateChip":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={baseClasses}
            {...props}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              className="fill-cookie-brown/10 stroke-cookie-brown"
            />
            {/* Chispas de chocolate */}
            <circle cx="8" cy="9" r="1.5" className="fill-cookie-chocolate" />
            <circle cx="15" cy="8" r="1" className="fill-cookie-chocolate" />
            <circle cx="10" cy="15" r="1.2" className="fill-cookie-chocolate" />
            <circle cx="17" cy="13" r="1.5" className="fill-cookie-chocolate" />
            <circle cx="13" cy="17" r="0.8" className="fill-cookie-chocolate" />
            <circle cx="6" cy="13" r="1" className="fill-cookie-chocolate" />
            {/* Textura */}
            <path
              d="M8,12 Q10,10 12,12 Q14,14 16,12"
              className="stroke-cookie-brown/30"
            />
          </svg>
        );

      case "sugar":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={baseClasses}
            {...props}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              className="fill-cookie-light stroke-cookie-brown"
            />
            {/* Azúcar */}
            <circle cx="9" cy="9" r="2" className="fill-white" />
            <circle cx="15" cy="9" r="1.5" className="fill-white" />
            <circle cx="11" cy="14" r="1.8" className="fill-white" />
            <circle cx="16" cy="16" r="1.2" className="fill-white" />
            <circle cx="7" cy="16" r="1.5" className="fill-white" />
          </svg>
        );

      case "gingerbread":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={baseClasses}
            {...props}
          >
            <path
              d="M12,2 C17,2 22,6 22,12 C22,18 17,22 12,22 C7,22 2,18 2,12 C2,6 7,2 12,2 Z"
              className="fill-cookie-chocolate stroke-cookie-brown"
            />
            {/* Decoración de jengibre */}
            <circle cx="12" cy="8" r="2" className="fill-cookie-cream" />
            <circle cx="8" cy="12" r="1.5" className="fill-cookie-cream" />
            <circle cx="16" cy="12" r="1.5" className="fill-cookie-cream" />
            <circle cx="12" cy="16" r="2" className="fill-cookie-cream" />
            <path
              d="M8,8 L16,16 M16,8 L8,16"
              className="stroke-cookie-cream"
              strokeWidth="1"
            />
          </svg>
        );

      case "macaron":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={baseClasses}
            {...props}
          >
            <ellipse
              cx="12"
              cy="12"
              rx="10"
              ry="6"
              className="fill-cookie-berry"
            />
            <ellipse
              cx="12"
              cy="10"
              rx="9"
              ry="5"
              className="fill-cookie-light"
            />
            <path d="M7,10 Q12,8 17,10" className="stroke-cookie-berry/50" />
            <path d="M7,14 Q12,16 17,14" className="stroke-cookie-berry/50" />
          </svg>
        );

      default:
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={baseClasses}
            {...props}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              className="fill-cookie-brown/10 stroke-cookie-brown"
            />
            <path
              d="M9,9 C9,9 11,7 12,9 C13,11 15,9 15,9"
              className="stroke-cookie-brown"
            />
            <path
              d="M9,15 C9,15 11,17 12,15 C13,13 15,15 15,15"
              className="stroke-cookie-brown"
            />
          </svg>
        );
    }
  };

  return (
    <div className={`inline-block ${animated ? "animate-float-cookie" : ""}`}>
      {renderCookie()}
    </div>
  );
};

// Icono de miga de galleta
export const CookieCrumbIcon = ({
  size = 16,
  className = "",
  ...props
}: LucideProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className={`text-cookie-brown ${className}`}
    {...props}
  >
    <path
      d="M8,2 C10,2 12,4 12,6 C12,8 10,10 8,10 C6,10 4,8 4,6 C4,4 6,2 8,2 Z"
      fill="currentColor"
      fillOpacity="0.3"
    />
    <circle cx="6" cy="5" r="1" fill="currentColor" fillOpacity="0.7" />
    <circle cx="10" cy="7" r="0.5" fill="currentColor" fillOpacity="0.7" />
  </svg>
);

// Icono de caja de galletas
export const CookieBoxIcon = ({
  size = 24,
  className = "",
  ...props
}: LucideProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-cookie-brown ${className}`}
    {...props}
  >
    <rect
      x="3"
      y="7"
      width="18"
      height="14"
      rx="2"
      className="fill-cookie-light stroke-cookie-brown"
    />
    <rect
      x="6"
      y="10"
      width="12"
      height="8"
      rx="1"
      className="fill-cookie-brown/10 stroke-cookie-brown/50"
    />
    {/* Galletas dentro */}
    <circle cx="9" cy="13" r="2" className="fill-cookie-brown/30" />
    <circle cx="15" cy="13" r="1.5" className="fill-cookie-brown/30" />
    <circle cx="12" cy="16" r="1.8" className="fill-cookie-brown/30" />
    {/* Lazo */}
    <path
      d="M12,7 L12,4 M10,4 C10,2 14,2 14,4"
      className="stroke-cookie-gold"
    />
  </svg>
);

export default CookieIcon;
