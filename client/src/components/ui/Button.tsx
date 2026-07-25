"use client";

import Link from "next/link";
import styles from "./Button.module.css";

export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  style?: React.CSSProperties;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  onClick,
  type = "button",
  disabled = false,
  style,
}: ButtonProps) {
  const baseClass = [
    styles.button,
    styles[variant],
    styles[size],
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    if (disabled) {
      return (
        <span className={baseClass} aria-disabled="true" style={style}>
          {children}
        </span>
      );
    }

    return (
      <Link href={href} className={baseClass} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      className={baseClass}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}
