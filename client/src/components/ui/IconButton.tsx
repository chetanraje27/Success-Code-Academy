import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./IconButton.module.css";

type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "children"
> & {
  label: string;
  children: ReactNode;
  size?: "sm" | "md";
  variant?: "neutral" | "brand" | "danger";
};

export default function IconButton({
  label,
  children,
  className = "",
  size = "md",
  variant = "neutral",
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      type={type}
      aria-label={label}
      className={`${styles.button} ${styles[size]} ${styles[variant]} ${className}`.trim()}
    >
      {children}
    </button>
  );
}
