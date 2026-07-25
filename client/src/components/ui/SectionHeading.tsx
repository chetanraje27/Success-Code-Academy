import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  return (
    <div
      className={[
        "section-heading",
        `align-${align}`,
        light ? "is-light" : "",
        styles.heading,
        styles[align],
        light ? styles.light : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <h2 className={`${styles.title} title`}>{title}</h2>
      {subtitle && <p className={`${styles.subtitle} subtitle`}>{subtitle}</p>}
    </div>
  );
}
