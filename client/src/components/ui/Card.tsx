import type { HTMLAttributes } from "react";
import styles from "./Card.module.css";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: "none" | "sm" | "md" | "lg";
  tone?: "default" | "subtle";
  hoverable?: boolean;
};

const paddingClasses = {
  none: styles.paddingNone,
  sm: styles.paddingSm,
  md: styles.paddingMd,
  lg: styles.paddingLg,
};

export default function Card({
  children,
  className = "",
  padding = "md",
  tone = "default",
  hoverable = false,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={[
        styles.card,
        paddingClasses[padding],
        tone === "subtle" ? styles.subtle : "",
        hoverable ? styles.hoverable : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
