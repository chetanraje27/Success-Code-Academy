import type { ReactNode } from "react";
import styles from "./PageHeader.module.css";

type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export default function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  align = "left",
  className = "",
}: PageHeaderProps) {
  return (
    <header
      className={`${styles.header} ${align === "center" ? styles.center : ""} ${className}`.trim()}
    >
      <div className={styles.content}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1 className={styles.title}>{title}</h1>
        {description ? (
          <p className={styles.description}>{description}</p>
        ) : null}
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  );
}
